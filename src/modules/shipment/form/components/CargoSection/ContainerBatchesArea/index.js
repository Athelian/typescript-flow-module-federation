// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { injectUid } from 'utils/id';
import { calculatePackageQuantity } from 'utils/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { ORDER_FORM, ORDER_ORDERITEMS_LIST } from 'modules/permission/constants/order';
import {
  BATCH_LIST,
  BATCH_CREATE,
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_UPDATE,
} from 'modules/permission/constants/batch';
import {
  CONTAINER_BATCHES_ADD,
  CONTAINER_BATCHES_REMOVE,
  CONTAINER_UPDATE,
} from 'modules/permission/constants/container';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_ADD_BATCH,
  SHIPMENT_ADD_BATCH_IN_CONTAINER,
  SHIPMENT_REMOVE_BATCH,
  SHIPMENT_REMOVE_BATCH_FROM_CONTAINER,
} from 'modules/permission/constants/shipment';
import { getByPath, isNullOrUndefined } from 'utils/fp';
import { ShipmentContainerBatchCard } from 'components/Cards';
import { NewButton, MoveButton, CancelButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import BatchFormWrapper from 'modules/batch/common/BatchFormWrapper';
import {
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import BatchFormContainer from 'modules/batch/form/container';
import SelectOrderItems from 'providers/SelectOrderItems';
import { getBatchesByContainerId } from 'modules/shipment/helpers';
import SelectBatches from 'modules/shipment/form/components/SelectBatches';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import {
  BatchesWrapperStyle,
  BatchesNavbarWrapperStyle,
  BatchesBodyWrapperStyle,
  BatchesHeaderWrapperStyle,
  TitleWrapperStyle,
  SubTitleWrapperStyle,
  SubTitleIconStyle,
  IconStyle,
  TitleStyle,
  BatchesGridStyle,
  EmptyMessageStyle,
  BatchesFooterWrapperStyle,
} from './style';

type Props = {
  containerId: string,
  containerIndex: number,
  isSelectBatchesMode: boolean,
  setIsSelectBatchesMode: Function,
  selectedBatches: Array<Object>,
  setSelectedBatches: Function,
};

export default function ContainerBatchesArea({
  containerId,
  containerIndex,
  isSelectBatchesMode,
  setIsSelectBatchesMode,
  selectedBatches,
  setSelectedBatches,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const allowToUpdate = hasPermission(SHIPMENT_UPDATE);
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

        if (batchesInContainer.length > 0 && isNullOrUndefined(representativeBatchId)) {
          setDeepFieldValue(
            `containers.${containerIndex}.representativeBatch`,
            batchesInContainer[0]
          );
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
                    {batchesInContainer.length > 0 &&
                      (hasPermission(SHIPMENT_UPDATE) ||
                        (hasPermission(CONTAINER_BATCHES_ADD) &&
                          hasPermission(CONTAINER_BATCHES_REMOVE))) && (
                        <>
                          {isSelectBatchesMode ? (
                            <>
                              <div className={SubTitleWrapperStyle}>
                                <FormattedMessage
                                  id="modules.Shipments.selected"
                                  defaultMessage="SELECTED {numOfBatches}"
                                  values={{
                                    numOfBatches: (
                                      <FormattedNumber value={selectedBatches.length} />
                                    ),
                                  }}
                                />
                                <div className={SubTitleIconStyle}>
                                  <Icon icon="BATCH" />
                                </div>
                              </div>
                              <CancelButton onClick={() => setIsSelectBatchesMode(false)} />
                            </>
                          ) : (
                            <MoveButton
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.moveBatches"
                                  defaultMessage="MOVE BATCHES"
                                />
                              }
                              onClick={() => setIsSelectBatchesMode(true)}
                            />
                          )}
                        </>
                      )}
                  </div>
                  <div className={BatchesGridStyle}>
                    {batchesInContainer.map((batch, position) => {
                      const allowRemoveBatch = getByPath('container', batch)
                        ? hasPermission([SHIPMENT_UPDATE, SHIPMENT_REMOVE_BATCH_FROM_CONTAINER])
                        : hasPermission([SHIPMENT_UPDATE, SHIPMENT_REMOVE_BATCH]);
                      const allowCloneBatch = getByPath('container', batch)
                        ? hasPermission(BATCH_CREATE) &&
                          hasPermission([SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH_IN_CONTAINER])
                        : hasPermission(BATCH_CREATE) &&
                          hasPermission([SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH]);
                      return (
                        <React.Fragment key={batch.id}>
                          {isSelectBatchesMode ? (
                            <ShipmentContainerBatchCard
                              batch={batch}
                              isRepresented={batch.id === representativeBatchId}
                              selectable
                              selected={selectedBatches.includes(batch)}
                              onSelect={() =>
                                allowToUpdate ? setSelectedBatches(batch) : () => {}
                              }
                            />
                          ) : (
                            <BooleanValue>
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
                                              const indexOfAllBatches = batches.indexOf(batch);
                                              setFieldArrayValue(indexOfAllBatches, updatedBatch);
                                              setDeepFieldValue(
                                                `containers.${containerIndex}.batches.${position}`,
                                                updatedBatch
                                              );
                                            }}
                                          />
                                        )}
                                      </Subscribe>
                                    )}
                                  </SlideView>
                                  <ShipmentContainerBatchCard
                                    batch={batch}
                                    editable={{
                                      no: hasPermission([BATCH_UPDATE, BATCH_SET_NO]),
                                      quantity: hasPermission([BATCH_UPDATE, BATCH_SET_QUANTITY]),
                                      deliveredAt: hasPermission([
                                        BATCH_UPDATE,
                                        BATCH_SET_DELIVERY_DATE,
                                      ]),
                                      desiredAt: hasPermission([
                                        BATCH_UPDATE,
                                        BATCH_SET_DESIRED_DATE,
                                      ]),
                                      removeBatch: allowRemoveBatch,
                                      cloneBatch: allowCloneBatch,
                                      viewOrder: hasPermission(ORDER_FORM),
                                      viewProduct: hasPermission(PRODUCT_FORM),
                                      setRepresentativeBatch: hasPermission([
                                        CONTAINER_UPDATE,
                                        CONTAINER_BATCHES_ADD,
                                        CONTAINER_BATCHES_REMOVE,
                                      ]),
                                    }}
                                    isRepresented={batch.id === representativeBatchId}
                                    saveOnBlur={updateBatch => {
                                      const indexOfAllBatches = batches.indexOf(batch);
                                      setFieldArrayValue(indexOfAllBatches, updateBatch);
                                      setDeepFieldValue(
                                        `containers.${containerIndex}.batches.${position}`,
                                        updateBatch
                                      );
                                    }}
                                    onClick={() => batchSlideToggle(true)}
                                    onClear={({ id }) => {
                                      setFieldValue(
                                        'batches',
                                        batches.filter(({ id: batchId }) => id !== batchId)
                                      );
                                      const newBatchesInContainer = batchesInContainer.filter(
                                        ({ id: batchId }) => id !== batchId
                                      );
                                      setDeepFieldValue(
                                        `containers.${containerIndex}.batches`,
                                        newBatchesInContainer
                                      );
                                      if (batch.id === representativeBatchId) {
                                        setDeepFieldValue(
                                          `containers.${containerIndex}.representativeBatch`,
                                          newBatchesInContainer[0]
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
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div className={BatchesFooterWrapperStyle}>
              {hasPermission(BATCH_LIST) &&
                (hasPermission(SHIPMENT_UPDATE) ||
                  (hasPermission(SHIPMENT_ADD_BATCH) &&
                    hasPermission(SHIPMENT_ADD_BATCH_IN_CONTAINER))) && (
                  <BooleanValue>
                    {({ value: selectBatchesIsOpen, set: selectBatchesSlideToggle }) => (
                      <>
                        <NewButton
                          data-testid="selectBatchesButton"
                          label={
                            <FormattedMessage
                              id="modules.Shipments.selectBatches"
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
                                const newSelectBatches = selected.map(selectedBatch => ({
                                  ...selectedBatch,
                                  container,
                                  packageQuantity: calculatePackageQuantity(selectedBatch),
                                }));
                                setFieldValue('batches', [...batches, ...newSelectBatches]);
                                setDeepFieldValue(`containers.${containerIndex}.batches`, [
                                  ...batchesInContainer,
                                  ...newSelectBatches,
                                ]);
                                if (batchesInContainer.length === 0) {
                                  setDeepFieldValue(
                                    `containers.${containerIndex}.representativeBatch`,
                                    newSelectBatches[0]
                                  );
                                }
                                selectBatchesSlideToggle(false);
                              }}
                              onCancel={() => selectBatchesSlideToggle(false)}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                )}

              {hasPermission(BATCH_CREATE) &&
                hasPermission(ORDER_ORDERITEMS_LIST) &&
                (hasPermission(SHIPMENT_UPDATE) ||
                  (hasPermission(SHIPMENT_ADD_BATCH) &&
                    hasPermission(SHIPMENT_ADD_BATCH_IN_CONTAINER))) && (
                  <BooleanValue>
                    {({ value: createBatchesIsOpen, set: createBatchesSlideToggle }) => (
                      <>
                        <NewButton
                          label={
                            <FormattedMessage
                              id="modules.Shipments.newBatch"
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
                                const createdBatches = selectedOrderItems.map(
                                  (orderItem, counter) => {
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
                                      isNew: true,
                                      orderItem,
                                      tags: [],
                                      packageName,
                                      packageCapacity,
                                      packageGrossWeight,
                                      packageVolume,
                                      packageSize,
                                      quantity: 0,
                                      batchAdjustments: [],
                                      no: `batch no ${batches.length + counter + 1}`,
                                      autoCalculatePackageQuantity: true,
                                      container,
                                    });
                                  }
                                );
                                setFieldValue('batches', [...batches, ...createdBatches]);
                                setDeepFieldValue(`containers.${containerIndex}.batches`, [
                                  ...batchesInContainer,
                                  ...createdBatches,
                                ]);
                                if (batchesInContainer.length === 0) {
                                  setDeepFieldValue(
                                    `containers.${containerIndex}.representativeBatch`,
                                    createdBatches[0]
                                  );
                                }
                                createBatchesSlideToggle(false);
                              }}
                              onCancel={() => createBatchesSlideToggle(false)}
                            />
                          )}
                        </SlideView>
                      </>
                    )}
                  </BooleanValue>
                )}
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}
