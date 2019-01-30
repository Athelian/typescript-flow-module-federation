// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectUid } from 'utils/id';
import { getByPath, isNullOrUndefined } from 'utils/fp';
import { ShipmentContainerBatchCard } from 'components/Cards';
import { NewButton, MoveButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import {
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import BatchFormContainer, { calculatePackageQuantity } from 'modules/batch/form/container';
import SelectOrderItems from 'providers/SelectOrderItems';
import { getBatchesByContainerId } from 'modules/shipment/helpers';
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
  containerId: string,
  containerIndex: number,
};

export default function ContainerBatchesArea({ containerId, containerIndex }: Props) {
  return (
    <Subscribe to={[ShipmentBatchesContainer, ShipmentContainersContainer]}>
      {(
        { state: { batches }, setFieldValue, setFieldArrayValue },
        { state, setDeepFieldValue }
      ) => {
        const batchesInContainer = getBatchesByContainerId(batches, containerId);
        const container = getByPath(`containers.${containerIndex}`, state);
        const representativeBatchId = getByPath(
          `containers.${containerIndex}.representativeBatch.id`,
          state
        );

        if (batchesInContainer.length > 0) {
          if (isNullOrUndefined(representativeBatchId)) {
            setDeepFieldValue(
              `containers.${containerIndex}.representativeBatch`,
              batchesInContainer[0]
            );
          }
        }
        return (
          <div className={BatchesWrapperStyle}>
            <div className={BatchesNavbarWrapperStyle} />
            <div className={BatchesBodyWrapperStyle}>
              {batchesInContainer.length === 0 ? (
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
                        <FormattedMessage id="modules.Shipments.batches" defaultMessage="BATCHES" />{' '}
                        (<FormattedNumber value={batchesInContainer.length} />)
                      </div>
                    </div>
                    <MoveButton
                      label={
                        <FormattedMessage
                          id="modules.shipment.moveBatches"
                          defaultMessage="MOVE BATCHES"
                        />
                      }
                      onClick={() => {}}
                    />
                  </div>
                  <div className={BatchesGridStyle}>
                    {batchesInContainer.map((batch, position) => (
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
                            <ShipmentContainerBatchCard
                              batch={batch}
                              isRepresented={batch.id === representativeBatchId}
                              saveOnBlur={updateBatch => {
                                setFieldArrayValue(position, updateBatch);
                              }}
                              onClick={() => batchSlideToggle(true)}
                              onClear={({ id }) => {
                                setFieldValue(
                                  'batches',
                                  batches.filter(({ id: batchId }) => id !== batchId)
                                );
                                setDeepFieldValue(
                                  `containers.${containerIndex}.batches`,
                                  batchesInContainer.filter(({ id: batchId }) => id !== batchId)
                                );
                                if (batch.id === representativeBatchId) {
                                  setDeepFieldValue(
                                    `containers.${containerIndex}.representativeBatch`,
                                    null
                                  );
                                }
                              }}
                              onClickRepresentative={() =>
                                setDeepFieldValue(
                                  `containers.${containerIndex}.representativeBatch`,
                                  batch
                                )
                              }
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
                                setDeepFieldValue(`containers.${containerIndex}.batches`, [
                                  ...batchesInContainer,
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
                      label={
                        <FormattedMessage
                          id="modules.shipment.selectBatches"
                          defaultMessage="SELECT BATCHES"
                        />
                      }
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
                              container,
                              packageQuantity: calculatePackageQuantity(selectedBatch),
                            }));
                            setFieldValue('batches', [...batches, ...selectedBatches]);
                            setDeepFieldValue(`containers.${containerIndex}.batches`, [
                              ...batchesInContainer,
                              ...selectedBatches,
                            ]);
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
                      label={
                        <FormattedMessage
                          id="modules.shipment.newBatch"
                          defaultMessage="NEW BATCH"
                        />
                      }
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
                            const createdBatches = selectedOrderItems.map((orderItem, counter) => {
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
                                container,
                              });
                            });
                            setFieldValue('batches', [...batches, ...createdBatches]);
                            setDeepFieldValue(`containers.${containerIndex}.batches`, [
                              ...batchesInContainer,
                              ...createdBatches,
                            ]);
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
