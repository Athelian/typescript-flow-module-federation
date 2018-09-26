// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectIntl, intlShape } from 'react-intl';
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
  intl: intlShape,
};

function CargoSection({ intl }: Props) {
  return (
    <div className={ItemsSectionWrapperStyle}>
      <SectionNavBar>
        <BooleanValue>
          {({ value: opened, toggle }) => (
            <>
              <NewButton label={intl.formatMessage(messages.selectBatches)} onClick={toggle} />
              <BooleanValue>
                {({ value: isOpen, toggle: toggleSlideView }) => (
                  <>
                    <NewButton
                      label={intl.formatMessage(messages.newBatch)}
                      onClick={toggleSlideView}
                    />
                    <SlideView
                      isOpen={isOpen}
                      onRequestClose={toggleSlideView}
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
                                toggleSlideView();
                              }}
                              onCancel={toggleSlideView}
                            />
                          )}
                        </Subscribe>
                      )}
                    </SlideView>
                  </>
                )}
              </BooleanValue>

              <SlideView isOpen={opened} onRequestClose={toggle} options={{ width: '1030px' }}>
                {opened && (
                  <Subscribe to={[ShipmentBatchesContainer]}>
                    {({ state: { batches }, setFieldValue }) => (
                      <SelectBatches
                        onCancel={toggle}
                        onSelect={selected => {
                          toggle();
                          setFieldValue('batches', [...batches, ...selected]);
                        }}
                      />
                    )}
                  </Subscribe>
                )}
              </SlideView>
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
                    {({ value: opened, toggle }) => (
                      <>
                        <SlideView
                          isOpen={opened}
                          onRequestClose={toggle}
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
                                  onCancel={toggle}
                                  onSave={updatedBatch => {
                                    toggle();
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
                            onClick={toggle}
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
