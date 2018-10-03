// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { SectionNavBar } from 'components/NavBar';
import { ShipmentBatchCard } from 'components/Cards';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import messages from 'modules/shipment/messages';
import SelectOrderItems from 'modules/batch/common/SelectOrderItems';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import BatchFormContainer from 'modules/batch/form/container';
import {
  ItemsSectionWrapperStyle,
  ItemsSectionBodyStyle,
  ItemGridStyle,
  ItemStyle,
  EmptyMessageStyle,
} from './style';
import SelectBatches from '../SelectBatches';

type Props = {
  intl: IntlShape,
};

function CargoSection({ intl }: Props) {
  return (
    <div className={ItemsSectionWrapperStyle}>
      <SectionNavBar>
        <BooleanValue>
          {({ value: opened, set: selectSlideToggle }) => (
            <>
              <NewButton
                label={intl.formatMessage(messages.selectBatches)}
                onClick={() => selectSlideToggle(true)}
              />
              <SlideView
                isOpen={opened}
                onRequestClose={() => selectSlideToggle(false)}
                options={{ width: '1030px' }}
              >
                {opened && (
                  <Subscribe to={[ShipmentBatchesContainer]}>
                    {({ state: { batches }, setFieldValue }) => (
                      <SelectBatches
                        onCancel={() => selectSlideToggle(false)}
                        onSelect={selected => {
                          selectSlideToggle(false);
                          setFieldValue('batches', [...batches, ...selected]);
                        }}
                      />
                    )}
                  </Subscribe>
                )}
              </SlideView>
              <BooleanValue>
                {({ value: isOpen, set: newSlideToggle }) => (
                  <>
                    <NewButton
                      label={intl.formatMessage(messages.newBatch)}
                      onClick={() => newSlideToggle(true)}
                    />
                    <SlideView
                      isOpen={isOpen}
                      onRequestClose={() => newSlideToggle(false)}
                      options={{ width: '1030px' }}
                    >
                      {isOpen && (
                        <Subscribe to={[ShipmentBatchesContainer]}>
                          {({ state: { batches }, setFieldValue }) => (
                            <SelectOrderItems
                              onSelect={selectedBatches => {
                                const result = selectedBatches.map((orderItem, counter) =>
                                  injectUid({
                                    orderItem,
                                    tags: [],
                                    quantity: 0,
                                    isNew: true,
                                    batchAdjustments: [],
                                    no: `batch no ${batches.length + counter + 1}`,
                                  })
                                );
                                setFieldValue('batches', [...batches, ...result]);
                                newSlideToggle(false);
                              }}
                              onCancel={() => newSlideToggle(false)}
                            />
                          )}
                        </Subscribe>
                      )}
                    </SlideView>
                  </>
                )}
              </BooleanValue>
            </>
          )}
        </BooleanValue>
      </SectionNavBar>
      <div className={ItemsSectionBodyStyle}>
        <Subscribe to={[ShipmentBatchesContainer]}>
          {({ state: { batches }, setFieldValue, setFieldArrayValue }) =>
            batches.length === 0 ? (
              <div className={EmptyMessageStyle}>No batches found.</div>
            ) : (
              <div className={ItemGridStyle}>
                {batches.map((item, position) => (
                  <BooleanValue key={item.id}>
                    {({ value: opened, set: batchSlideToggle }) => (
                      <>
                        <SlideView
                          isOpen={opened}
                          onRequestClose={() => batchSlideToggle(false)}
                          options={{ width: '1030px' }}
                        >
                          {opened && (
                            <Subscribe to={[BatchFormContainer]}>
                              {({ initDetailValues }) => (
                                <BatchFormWrapper
                                  initDetailValues={initDetailValues}
                                  batch={item}
                                  isNew={!!item.isNew}
                                  orderItem={item.orderItem}
                                  onCancel={() => batchSlideToggle(false)}
                                  onSave={updatedBatch => {
                                    batchSlideToggle(false);
                                    setFieldArrayValue(position, updatedBatch);
                                  }}
                                />
                              )}
                            </Subscribe>
                          )}
                        </SlideView>
                        <div className={ItemStyle}>
                          <ShipmentBatchCard
                            batch={item}
                            saveOnBlur={updateBatch => {
                              setFieldArrayValue(position, updateBatch);
                            }}
                            onClick={() => batchSlideToggle(true)}
                            onRemove={({ id }) => {
                              setFieldValue(
                                'batches',
                                batches.filter(({ id: itemId }) => id !== itemId)
                              );
                            }}
                            onClone={({ id, ...rest }) => {
                              setFieldValue('batches', [
                                ...batches,
                                injectUid({
                                  ...rest,
                                  isNew: true,
                                }),
                              ]);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </BooleanValue>
                ))}
              </div>
            )
          }
        </Subscribe>
      </div>
    </div>
  );
}

export default injectIntl(CargoSection);
