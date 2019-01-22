// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { ShipmentBatchCard } from 'components/Cards';
import { NewButton } from 'components/Buttons';
import SlideView from 'components/SlideView';
import messages from 'modules/shipment/messages';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import BatchFormContainer, { calculatePackageQuantity } from 'modules/batch/form/container';
import SelectOrderItems from '../CargoSection/components/SelectOrderItems';
import {
  CargoSectionWrapperStyle,
  NavbarWrapperStyle,
  NavbarLeftWrapperStyle,
  NavbarRightWrapperStyle,
  CargoBodyWrapperStyle,
  ContainersBodyWrapperStyle,
  BatchesBodyWrapperStyle,
  EmptyMessageStyle,
  FooterWrapperStyle,
  FooterLeftWrapperStyle,
  FooterRightWrapperStyle,
} from './style';
import SelectBatches from '../SelectBatches';

type Props = {
  intl: IntlShape,
};

function CargoSection({ intl }: Props) {
  return (
    <div className={CargoSectionWrapperStyle}>
      <div className={NavbarWrapperStyle}>
        <div className={NavbarLeftWrapperStyle} />
        <div className={NavbarRightWrapperStyle} />
      </div>
      <div className={CargoBodyWrapperStyle}>
        <div className={ContainersBodyWrapperStyle}>hi</div>
        <Subscribe to={[ShipmentBatchesContainer]}>
          {({ state: { batches }, setFieldValue, setFieldArrayValue }) =>
            batches.length === 0 ? (
              <div className={EmptyMessageStyle}>
                <FormattedMessage
                  id="modules.Shipments.noBatches"
                  defaultMessage="No batches found"
                />
              </div>
            ) : (
              <div className={BatchesBodyWrapperStyle}>
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
                        <ShipmentBatchCard
                          batch={item}
                          saveOnBlur={updateBatch => {
                            setFieldArrayValue(position, updateBatch);
                          }}
                          onClick={() => batchSlideToggle(true)}
                          onClear={({ id }) => {
                            setFieldValue(
                              'batches',
                              batches.filter(({ id: itemId }) => id !== itemId)
                            );
                          }}
                          onClone={({
                            id,
                            deliveredAt,
                            desired,
                            expiredAt,
                            producedAt,
                            no,
                            ...rest
                          }) => {
                            setFieldValue('batches', [
                              ...batches,
                              injectUid({
                                ...rest,
                                isNew: true,
                                batchAdjustments: [],
                                no: `${no}- clone`,
                              }),
                            ]);
                          }}
                        />
                      </>
                    )}
                  </BooleanValue>
                ))}
              </div>
            )
          }
        </Subscribe>
      </div>
      <div className={FooterWrapperStyle}>
        <div className={FooterLeftWrapperStyle}>
          <NewButton label={intl.formatMessage(messages.newContainer)} onClick={() => {}} />
        </div>
        <div className={FooterRightWrapperStyle}>
          <BooleanValue>
            {({ value: selectBatchesIsOpen, set: selectBatchesSlideToggle }) => (
              <>
                <NewButton
                  data-testid="selectBatchesButton"
                  label={intl.formatMessage(messages.selectBatches)}
                  onClick={() => selectBatchesSlideToggle(true)}
                />
                <SlideView
                  isOpen={selectBatchesIsOpen}
                  onRequestClose={() => selectBatchesSlideToggle(false)}
                  options={{ width: '1030px' }}
                >
                  {selectBatchesIsOpen && (
                    <Subscribe to={[ShipmentBatchesContainer]}>
                      {({ state: { batches }, setFieldValue }) => (
                        <SelectBatches
                          selectedBatches={batches}
                          onSelect={selected => {
                            const selectedBatches = selected.map(selectedBatch => ({
                              ...selectedBatch,
                              packageQuantity: calculatePackageQuantity(selectedBatch),
                            }));
                            setFieldValue('batches', [...batches, ...selectedBatches]);
                            selectBatchesSlideToggle(false);
                          }}
                          onCancel={() => selectBatchesSlideToggle(false)}
                        />
                      )}
                    </Subscribe>
                  )}
                </SlideView>
              </>
            )}
          </BooleanValue>
          <BooleanValue>
            {({ value: createBatchesIsOpen, set: createBatchesSlideToggle }) => (
              <>
                <NewButton
                  label={intl.formatMessage(messages.newBatch)}
                  onClick={() => createBatchesSlideToggle(true)}
                />
                <SlideView
                  isOpen={createBatchesIsOpen}
                  onRequestClose={() => createBatchesSlideToggle(false)}
                  options={{ width: '1030px' }}
                >
                  {createBatchesIsOpen && (
                    <Subscribe to={[ShipmentBatchesContainer]}>
                      {({ state: { batches }, setFieldValue }) => (
                        <SelectOrderItems
                          onSelect={selectedOrderItems => {
                            const result = selectedOrderItems.map((orderItem, counter) => {
                              const {
                                productProvider: {
                                  packageName,
                                  packageCapacity,
                                  packageGrossWeight,
                                  packageVolume,
                                  packageSize,
                                },
                              } = orderItem;
                              return injectUid({
                                orderItem,
                                tags: [],
                                packageName,
                                packageCapacity,
                                packageGrossWeight,
                                packageVolume,
                                packageSize,
                                quantity: 0,
                                isNew: true,
                                batchAdjustments: [],
                                no: `batch no ${batches.length + counter + 1}`,
                                autoCalculatePackageQuantity: true,
                              });
                            });
                            setFieldValue('batches', [...batches, ...result]);
                            createBatchesSlideToggle(false);
                          }}
                          onCancel={() => createBatchesSlideToggle(false)}
                        />
                      )}
                    </Subscribe>
                  )}
                </SlideView>
              </>
            )}
          </BooleanValue>
        </div>
      </div>
    </div>
  );
}

export default injectIntl(CargoSection);
