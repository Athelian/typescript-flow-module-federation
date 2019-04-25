// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import FormattedNumber from 'components/FormattedNumber';
import { generateBatchByOrderItem, generateBatchForClone } from 'utils/batch';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { SectionNavBar } from 'components/NavBar';
import { OrderBatchCard } from 'components/Cards';
import { NewButton, BaseButton } from 'components/Buttons';
import { getBatchByFillBatch } from 'modules/order/helpers';
import SlideView from 'components/SlideView';
import {
  OrderItemInfoContainer,
  OrderItemBatchesContainer,
} from 'modules/orderItem/form/containers';

import BatchFormInSlide from 'modules/batch/common/BatchFormInSlide';

import {
  BatchesSectionWrapperStyle,
  BatchesSectionBodyStyle,
  BatchesGridStyle,
  ItemStyle,
  EmptyMessageStyle,
} from './style';

function BatchesSection() {
  return (
    <Subscribe to={[OrderItemInfoContainer, OrderItemBatchesContainer]}>
      {({ state: infoState }, { state: { batches }, setFieldValue, setDeepFieldValue }) => {
        const values = { ...infoState, batches };
        return (
          <SectionWrapper id="orderItem_batchesSection">
            <SectionHeader
              icon="BATCH"
              title={
                <>
                  <FormattedMessage id="modules.orderItem.batches" defaultMessage="BATCHES" /> (
                  <FormattedNumber value={batches.length} />)
                </>
              }
            />
            <div className={BatchesSectionWrapperStyle}>
              <SectionNavBar>
                <NewButton
                  label={
                    <FormattedMessage id="modules.orderItem.newBatch" defaultMessage="NEW BATCH" />
                  }
                  onClick={() => {
                    setFieldValue('batches', [
                      ...batches,
                      {
                        ...generateBatchByOrderItem(values),
                        no: `batch no ${batches.length + 1}`,
                      },
                    ]);
                  }}
                />
                <BaseButton
                  label={
                    <FormattedMessage
                      id="modules.orderItem.autoFillBatch"
                      defaultMessage="AUTOFILL BATCH"
                    />
                  }
                  onClick={() => {
                    const newBatch = getBatchByFillBatch(values);
                    if (newBatch) {
                      setFieldValue('batches', [...batches, newBatch]);
                    }
                  }}
                />
              </SectionNavBar>
              <div className={BatchesSectionBodyStyle}>
                {batches.length === 0 ? (
                  <div className={EmptyMessageStyle}>
                    <FormattedMessage
                      id="modules.container.noBatches"
                      defaultMessage="No batches found"
                    />
                  </div>
                ) : (
                  <div className={BatchesGridStyle}>
                    {batches.map((batch, index) => (
                      <BooleanValue key={batch.id}>
                        {({ value: opened, set: batchSlideToggle }) => (
                          <>
                            <SlideView
                              isOpen={opened}
                              onRequestClose={() => batchSlideToggle(false)}
                            >
                              {opened && (
                                <BatchFormInSlide
                                  batch={batch}
                                  onSave={value => {
                                    batchSlideToggle(false);
                                    setDeepFieldValue(`batches.${index}`, value);
                                  }}
                                />
                              )}
                            </SlideView>
                            <div className={ItemStyle}>
                              <OrderBatchCard
                                editable
                                batch={batch}
                                currency={infoState.price.currency}
                                price={infoState.price}
                                onClick={() => batchSlideToggle(true)}
                                saveOnBlur={value => setDeepFieldValue(`batches.${index}`, value)}
                                onRemove={() =>
                                  setFieldValue(
                                    'batches',
                                    batches.filter(item => item.id !== batch.id)
                                  )
                                }
                                onClone={value =>
                                  setFieldValue('batches', [
                                    ...batches,
                                    generateBatchForClone(value),
                                  ])
                                }
                              />
                            </div>
                          </>
                        )}
                      </BooleanValue>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionWrapper>
        );
      }}
    </Subscribe>
  );
}

export default BatchesSection;
