// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { BooleanValue } from 'react-values';
import { getByPath } from 'utils/fp';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { PRODUCT_FORM } from 'modules/permission/constants/product';
import {
  CONTAINER_FORM,
  CONTAINER_UPDATE,
  CONTAINER_BATCHES_ADD,
  CONTAINER_BATCHES_REMOVE,
} from 'modules/permission/constants/container';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_ADD_BATCH,
  SHIPMENT_REMOVE_BATCH,
} from 'modules/permission/constants/shipment';
import {
  BATCH_LIST,
  BATCH_CREATE,
  BATCH_SET_NO,
  BATCH_SET_QUANTITY,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_UPDATE,
  BATCH_TASK_LIST,
} from 'modules/permission/constants/batch';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { ORDER_ITEMS_LIST, ORDER_ITEMS_GET_PRICE } from 'modules/permission/constants/orderItem';
import {
  calculatePackageQuantity,
  generateBatchForClone,
  generateBatchByOrderItem,
} from 'utils/batch';
import { ShipmentBatchCard } from 'components/Cards';
import { NewButton, MoveButton, CancelButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import SlideView from 'components/SlideView';
import Icon from 'components/Icon';
import BatchFormInSlide from 'modules/batch/common/BatchFormInSlide';
import {
  ShipmentBatchesContainer,
  ShipmentContainersContainer,
} from 'modules/shipment/form/containers';
import SelectOrderItems from 'providers/SelectOrderItems';
import { getBatchesInPool, getBatchesByContainerId } from 'modules/shipment/helpers';
import SelectBatches from 'modules/shipment/form/components/SelectBatches';
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
  isFocusedBatchesPool: boolean,
  isSelectBatchesMode: boolean,
  onChangeSelectMode: Function,
  focusedContainerIndex: number,
  selectedBatches: Array<Object>,
  onSelectBatch: Function,
};

function BatchesArea({
  isFocusedBatchesPool,
  isSelectBatchesMode,
  onChangeSelectMode,
  focusedContainerIndex,
  selectedBatches,
  onSelectBatch,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  return (
    <Subscribe to={[ShipmentBatchesContainer, ShipmentContainersContainer]}>
      {(
        {
          state: { batches },
          setFieldValue,
          setFieldArrayValue,
          addExistingBatches,
          removeExistingBatches,
        },
        { state: { containers }, setFieldValue: setContainersState, setDeepFieldValue }
      ) => {
        const isFocusedContainer = focusedContainerIndex >= 0;
        let representativeBatchId = null;
        const containerId = isFocusedContainer ? containers[focusedContainerIndex].id : null;
        const currentBatches = isFocusedBatchesPool
          ? getBatchesInPool(batches)
          : getBatchesByContainerId(batches, containerId);
        if (containerId) {
          const container = containers[focusedContainerIndex];
          representativeBatchId = getByPath(`representativeBatch.id`, container);

          // FIXME: Try to fix the representativeBatch without set state on rendering UI
          if (currentBatches.length > 0 && !representativeBatchId) {
            setDeepFieldValue(
              `containers.${focusedContainerIndex}.representativeBatch`,
              currentBatches[0]
            );
          }
        }

        const allowMoveBatches =
          hasPermission(SHIPMENT_UPDATE) ||
          (hasPermission(CONTAINER_BATCHES_ADD) && isFocusedContainer
            ? hasPermission(CONTAINER_BATCHES_REMOVE)
            : true);

        const allowSelectBatches =
          hasPermission(BATCH_LIST) &&
          (hasPermission(SHIPMENT_UPDATE) ||
            (hasPermission(SHIPMENT_ADD_BATCH) && isFocusedContainer
              ? hasPermission(CONTAINER_BATCHES_ADD)
              : true));

        const allowNewBatches =
          hasPermission(BATCH_CREATE) &&
          hasPermission(ORDER_ITEMS_LIST) &&
          (hasPermission(SHIPMENT_UPDATE) ||
            (hasPermission(SHIPMENT_ADD_BATCH) && isFocusedContainer
              ? hasPermission(CONTAINER_BATCHES_ADD)
              : true));

        return (
          <div className={BatchesWrapperStyle}>
            <div className={BatchesNavbarWrapperStyle} />
            <div className={BatchesBodyWrapperStyle}>
              {currentBatches.length === 0 ? (
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
                        {isFocusedBatchesPool || isFocusedContainer ? (
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
                        (<FormattedNumber value={currentBatches.length} />)
                      </div>
                    </div>

                    {(isFocusedBatchesPool || isFocusedContainer) &&
                      allowMoveBatches &&
                      currentBatches.length > 0 &&
                      containers.length > 0 && (
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
                              <CancelButton onClick={() => onChangeSelectMode(false)} />
                            </>
                          ) : (
                            <MoveButton
                              label={
                                <FormattedMessage
                                  id="modules.Shipments.moveBatches"
                                  defaultMessage="MOVE BATCHES"
                                />
                              }
                              onClick={() => onChangeSelectMode(true)}
                            />
                          )}
                        </>
                      )}
                  </div>

                  <div className={BatchesGridStyle}>
                    {currentBatches.map(batch => {
                      const allowRemoveBatch = getByPath('container', batch)
                        ? hasPermission(SHIPMENT_UPDATE) ||
                          (hasPermission(CONTAINER_BATCHES_REMOVE) &&
                            hasPermission(SHIPMENT_REMOVE_BATCH))
                        : hasPermission([SHIPMENT_UPDATE, SHIPMENT_REMOVE_BATCH]);

                      const allowCloneBatch = getByPath('container', batch)
                        ? hasPermission(BATCH_CREATE) &&
                          hasPermission([SHIPMENT_UPDATE, CONTAINER_BATCHES_ADD])
                        : hasPermission(BATCH_CREATE) &&
                          hasPermission([SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH]);

                      return (
                        <React.Fragment key={batch.id}>
                          {isSelectBatchesMode ? (
                            <ShipmentBatchCard
                              batch={batch}
                              isRepresented={
                                isFocusedBatchesPool ||
                                (!isFocusedBatchesPool && !isFocusedContainer)
                                  ? null
                                  : batch.id === representativeBatchId
                              }
                              selectable
                              selected={selectedBatches.includes(batch)}
                              onSelect={() => (allowMoveBatches ? onSelectBatch(batch) : () => {})}
                              read={{
                                price: hasPermission(ORDER_ITEMS_GET_PRICE),
                                tasks: hasPermission(BATCH_TASK_LIST),
                              }}
                            />
                          ) : (
                            <BooleanValue>
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

                                          const indexOfAllBatches = batches.indexOf(batch);
                                          setFieldArrayValue(indexOfAllBatches, value);
                                          if (batch.container) {
                                            const indexOfContainer = containers.findIndex(
                                              container => container.id === batch.container.id
                                            );
                                            if (indexOfContainer >= 0) {
                                              const indexOfBatch = containers[
                                                indexOfContainer
                                              ].batches.findIndex(
                                                containersBatch => containersBatch.id === batch.id
                                              );
                                              if (indexOfBatch >= 0) {
                                                setDeepFieldValue(
                                                  `containers.${indexOfContainer}.batches.${indexOfBatch}`,
                                                  value
                                                );
                                              }
                                            }
                                          }
                                        }}
                                      />
                                    )}
                                  </SlideView>

                                  <ShipmentBatchCard
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
                                      representativeBatch: hasPermission([
                                        CONTAINER_UPDATE,
                                        CONTAINER_BATCHES_ADD,
                                        CONTAINER_BATCHES_REMOVE,
                                      ]),
                                    }}
                                    navigate={{
                                      order: hasPermission(ORDER_FORM),
                                      product: hasPermission(PRODUCT_FORM),
                                      container: hasPermission(CONTAINER_FORM),
                                    }}
                                    read={{
                                      price: hasPermission(ORDER_ITEMS_GET_PRICE),
                                      tasks: hasPermission(BATCH_TASK_LIST),
                                    }}
                                    batch={batch}
                                    isRepresented={
                                      isFocusedBatchesPool ||
                                      (!isFocusedBatchesPool && !isFocusedContainer)
                                        ? null
                                        : batch.id === representativeBatchId
                                    }
                                    saveOnBlur={updatedBatch => {
                                      const indexOfAllBatches = batches.indexOf(batch);
                                      setFieldArrayValue(indexOfAllBatches, updatedBatch);
                                      if (batch.container) {
                                        const indexOfContainer = containers.findIndex(
                                          container => container.id === batch.container.id
                                        );
                                        if (indexOfContainer >= 0) {
                                          const indexOfBatch = containers[
                                            indexOfContainer
                                          ].batches.findIndex(
                                            containersBatch => containersBatch.id === batch.id
                                          );
                                          if (indexOfBatch >= 0) {
                                            setDeepFieldValue(
                                              `containers.${indexOfContainer}.batches.${indexOfBatch}`,
                                              updatedBatch
                                            );
                                          }
                                        }
                                      }
                                    }}
                                    onClick={() => batchSlideToggle(true)}
                                    onClear={clearedBatch => {
                                      setFieldValue(
                                        'batches',
                                        batches.filter(
                                          ({ id: batchId }) => batchId !== clearedBatch.id
                                        )
                                      );

                                      removeExistingBatches([clearedBatch]);

                                      const newContainers = containers.map(container => {
                                        const {
                                          batches: containerBatches,
                                          representativeBatch,
                                          ...rest
                                        } = container;

                                        const newContainerBatches = containerBatches.filter(
                                          ({ id: batchId }) => batchId !== clearedBatch.id
                                        );

                                        const newRepresentativeBatch =
                                          representativeBatch &&
                                          representativeBatch.id === clearedBatch.id
                                            ? newContainerBatches[0]
                                            : representativeBatch;

                                        return {
                                          ...rest,
                                          batches: newContainerBatches,
                                          representativeBatch: newRepresentativeBatch,
                                        };
                                      });
                                      setContainersState('containers', newContainers);
                                    }}
                                    onClickRepresentative={() =>
                                      isFocusedContainer
                                        ? setDeepFieldValue(
                                            `containers.${focusedContainerIndex}.representativeBatch`,
                                            batch
                                          )
                                        : () => {}
                                    }
                                    onClone={value => {
                                      setFieldValue('batches', [
                                        ...batches,
                                        generateBatchForClone(value),
                                      ]);
                                      if (isFocusedContainer) {
                                        setDeepFieldValue(
                                          `containers.${focusedContainerIndex}.batches`,
                                          [...currentBatches, generateBatchForClone(value)]
                                        );
                                      }
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
              {!isSelectBatchesMode && (
                <>
                  {allowSelectBatches && (
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
                          >
                            {selectBatchesIsOpen && (
                              <SelectBatches
                                selectedBatches={batches}
                                onSelect={selected => {
                                  const newSelectBatches = selected.map(selectedBatch => ({
                                    ...selectedBatch,
                                    ...(isFocusedContainer
                                      ? { container: containers[focusedContainerIndex] }
                                      : {}),
                                    packageQuantity: calculatePackageQuantity(selectedBatch),
                                  }));
                                  if (isFocusedContainer) {
                                    setDeepFieldValue(
                                      `containers.${focusedContainerIndex}.batches`,
                                      [...currentBatches, ...newSelectBatches]
                                    );
                                    if (currentBatches.length === 0) {
                                      setDeepFieldValue(
                                        `containers.${focusedContainerIndex}.representativeBatch`,
                                        newSelectBatches[0]
                                      );
                                    }
                                  }
                                  setFieldValue('batches', [...batches, ...newSelectBatches]);
                                  addExistingBatches(newSelectBatches);

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

                  {allowNewBatches && (
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
                          >
                            {createBatchesIsOpen && (
                              <SelectOrderItems
                                onSelect={selectedOrderItems => {
                                  const createdBatches = selectedOrderItems.map(
                                    (orderItem, index) => ({
                                      ...generateBatchByOrderItem(orderItem),
                                      no: `batch no ${batches.length + index + 1}`,
                                      ...(isFocusedContainer
                                        ? { container: containers[focusedContainerIndex] }
                                        : {}),
                                    })
                                  );
                                  setFieldValue('batches', [...batches, ...createdBatches]);
                                  if (isFocusedContainer) {
                                    setDeepFieldValue(
                                      `containers.${focusedContainerIndex}.batches`,
                                      [...currentBatches, ...createdBatches]
                                    );
                                    if (currentBatches.length === 0) {
                                      setDeepFieldValue(
                                        `containers.${focusedContainerIndex}.representativeBatch`,
                                        createdBatches[0]
                                      );
                                    }
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
                </>
              )}
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}

export default BatchesArea;
