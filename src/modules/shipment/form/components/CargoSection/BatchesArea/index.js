// @flow
import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import type { IntlShape } from 'react-intl';
import { injectUid } from 'utils/id';
import { ShipmentBatchCard } from 'components/Cards';
import { NewButton, MoveButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import messages from 'modules/shipment/messages';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import {
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import BatchFormContainer, { calculatePackageQuantity } from 'modules/batch/form/container';
import SelectOrderItems from 'providers/SelectOrderItems';
import { getBatchesInPool } from 'modules/shipment/helpers';
import SelectBatches from 'modules/shipment/form/components/SelectBatches';
import {
  BatchesWrapperStyle,
  BatchesNavbarWrapperStyle,
  BatchesBodyWrapperStyle,
  BatchesHeaderWrapperStyle,
  TitleWrapperStyle,
  IconStyle,
  TitleStyle,
  BatchesGridStyle,
  EmptyMessageStyle,
  BatchesFooterWrapperStyle,
} from './style';

type Props = {
  intl: IntlShape,
  isSelectedBatchesPool: boolean,
};

function BatchesArea({ intl, isSelectedBatchesPool }: Props) {
  return (
    <Subscribe to={[ShipmentBatchesContainer, ShipmentContainersContainer]}>
      {({ state: { batches }, setFieldValue, setFieldArrayValue }, { state: { containers } }) => {
        const usefulBatches = isSelectedBatchesPool ? getBatchesInPool(batches) : [...batches];
        return (
          <div className={BatchesWrapperStyle}>
            <div className={BatchesNavbarWrapperStyle} />
            <div className={BatchesBodyWrapperStyle}>
              {usefulBatches.length === 0 ? (
                <div className={EmptyMessageStyle}>
                  <FormattedMessage
                    id="modules.Shipments.noBatches"
                    defaultMessage="No batches found"
                  />
                </div>
              ) : (
                <>
                  <div className={BatchesHeaderWrapperStyle}>
                    <div className={TitleWrapperStyle}>
                      <div className={IconStyle}>
                        <Icon icon="BATCH" />
                      </div>
                      <div className={TitleStyle}>
                        {isSelectedBatchesPool ? (
                          <FormattedMessage
                            id="modules.Shipments.batches"
                            defaultMessage="BATCHES"
                          />
                        ) : (
                          <FormattedMessage
                            id="modules.Shipments.allBatches"
                            defaultMessage="ALL BATCHES"
                          />
                        )}{' '}
                        (<FormattedNumber value={usefulBatches.length} />)
                      </div>
                    </div>

                    {usefulBatches.length > 0 && containers.length > 0 && (
                      <MoveButton
                        label={
                          <FormattedMessage
                            id="modules.shipment.moveBatches"
                            defaultMessage="MOVE BATCHES"
                          />
                        }
                        onClick={() => {}}
                      />
                    )}
                  </div>
                  <div className={BatchesGridStyle}>
                    {usefulBatches.map((batch, position) => (
                      <BooleanValue key={batch.id}>
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
                                      batch={batch}
                                      isNew={!!batch.isNew}
                                      orderItem={batch.orderItem}
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
                              batch={batch}
                              saveOnBlur={updateBatch => {
                                const indexOfAllBatches = batches.indexOf(batch);
                                setFieldArrayValue(indexOfAllBatches, updateBatch);
                              }}
                              onClick={() => batchSlideToggle(true)}
                              onClear={({ id }) => {
                                setFieldValue(
                                  'batches',
                                  batches.filter(({ id: batchId }) => id !== batchId)
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
                </>
              )}
            </div>
            <div className={BatchesFooterWrapperStyle}>
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
                    </SlideView>
                  </>
                )}
              </BooleanValue>
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}

export default injectIntl(BatchesArea);
