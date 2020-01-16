// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import emitter from 'utils/emitter';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { SHIPMENT_REMOVE_BATCH } from 'modules/permission/constants/shipment';
import {
  CONTAINER_FORM,
  CONTAINER_CREATE,
  CONTAINER_DELETE,
  CONTAINER_UPDATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_CONTAINER_TYPE,
  CONTAINER_SET_CONTAINER_OPTION,
  CONTAINER_SET_WAREHOUSE,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
} from 'modules/permission/constants/container';
import { getByPath, isNullOrUndefined } from 'utils/fp';
import { generateContainer } from 'utils/container';
import { getLatestDate } from 'utils/shipment';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import Action from 'modules/shipment/form/components/Action';
import {
  ShipmentInfoContainer,
  ShipmentContainersContainer,
  ShipmentBatchesContainer,
  ShipmentTimelineContainer,
} from 'modules/shipment/form/containers';
import { WAREHOUSE_FORM, WAREHOUSE_LIST } from 'modules/permission/constants/warehouse';
import { ShipmentContainerCard, CardAction, BatchesPoolCard } from 'components/Cards';
import Icon from 'components/Icon';
import { getBatchesInPool } from 'modules/shipment/helpers';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import ContainerFormInSlide from 'modules/container/common/ContainerFormInSlide';
import RemoveContainerConfirmDialog from './components/RemoveContainerConfirmDialog';

import {
  ContainersWrapperStyle,
  ContainersNavbarWrapperStyle,
  ContainersBodyWrapperStyle,
  ContainersHeaderWrapperStyle,
  IconStyle,
  TitleStyle,
  ContainersGridStyle,
  SelectBatchesPoolCardWrapperStyle,
  SelectContainerCardWrapperStyle,
  SelectContainerCardBackgroundStyle,
  EyeballIconStyle,
  ContainersFooterWrapperStyle,
} from './style';

type Props = {
  selectedBatches: Array<Object>,
  focusedContainerIndex: number,
  onSelect: (selectId: number) => void,
  onSelectPool: () => void,
  onDeselect: () => void,
  isFocusedBatchesPool: boolean,
  isSelectBatchesMode: boolean,
  onChangeSelectMode: Function,
  shipmentIsArchived: boolean,
};

const includesById = (id: string, items: Array<Object>): boolean =>
  items.map(item => item.id).includes(id);

const removeContainerById = (containers: Array<Object>, id: string): Array<Object> =>
  containers.filter(container => container.id !== id);

const removeBatchesByContainerId = (batches: Array<Object>, containerId: string): Array<Object> =>
  batches.filter(
    ({ container }) =>
      isNullOrUndefined(container) ||
      (!isNullOrUndefined(container) && container.id !== containerId)
  );

const cleanBatchesContainerByContainerId = (
  batches: Array<Object>,
  containerId: string
): Array<Object> =>
  batches.map(batch =>
    batch.container && batch.container.id === containerId
      ? {
          ...batch,
          container: null,
        }
      : { ...batch }
  );

const getNewSourceContainer = (
  sourceContainer: Object,
  selectedBatches: Array<Object>
): { batches: Array<Object>, representativeBatch: Object } => {
  const { batches, representativeBatch, ...rest } = sourceContainer;
  const newBatches = batches.filter(batch => !includesById(batch.id, selectedBatches));
  const newRepresentativeBatch = includesById(representativeBatch.id, newBatches)
    ? representativeBatch
    : newBatches[0];
  return { ...rest, batches: newBatches, representativeBatch: newRepresentativeBatch };
};

function ContainersArea({
  selectedBatches,
  isFocusedBatchesPool,
  isSelectBatchesMode,
  onChangeSelectMode,
  focusedContainerIndex,
  onSelectPool,
  onDeselect,
  onSelect,
  shipmentIsArchived,
}: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  const allowSetWarehouse =
    hasPermission([CONTAINER_UPDATE, CONTAINER_SET_WAREHOUSE]) && hasPermission(WAREHOUSE_LIST);

  return (
    <Subscribe
      to={[ShipmentContainersContainer, ShipmentBatchesContainer, ShipmentTimelineContainer]}
    >
      {(
        {
          originalValues: containersOriginalValues,
          state: containersState,
          setFieldValue,
          setDeepFieldValue,
        },
        {
          state: { batches },
          setFieldValue: setBatchesState,
          removeExistingBatches,
          changeContainerIdToExistingBatches,
        },
        { state: { voyages }, setFieldDeepValue: setTimelineState }
      ) => {
        const batchesInPool = getBatchesInPool(batches);
        const { containers } = { ...containersOriginalValues, ...containersState };
        const isFocusedContainer = focusedContainerIndex >= 0;

        if (isFocusedContainer && isNullOrUndefined(containers[focusedContainerIndex])) {
          onDeselect();
        }

        return (
          <div className={ContainersWrapperStyle}>
            <div className={ContainersNavbarWrapperStyle} />
            <div className={ContainersBodyWrapperStyle}>
              <div className={ContainersHeaderWrapperStyle}>
                <div className={IconStyle}>
                  <Icon icon="CONTAINER" />
                </div>
                <div className={TitleStyle}>
                  <FormattedMessage id="modules.Shipments.containers" defaultMessage="CONTAINERS" />{' '}
                  (
                  <FormattedNumber value={containers.length} />)
                </div>
              </div>
              <div className={ContainersGridStyle}>
                <div
                  className={SelectBatchesPoolCardWrapperStyle(isFocusedBatchesPool)}
                  role="presentation"
                  onClick={!isSelectBatchesMode ? onSelectPool : () => {}}
                >
                  {!isSelectBatchesMode && (
                    <div className={EyeballIconStyle}>
                      <Icon icon={isFocusedBatchesPool ? 'INVISIBLE' : 'VISIBLE'} />
                    </div>
                  )}
                  <BatchesPoolCard
                    totalBatches={batchesInPool.length}
                    product={
                      batchesInPool.length > 0
                        ? getByPath('orderItem.productProvider.product', batchesInPool[0])
                        : null
                    }
                  />
                  {isSelectBatchesMode &&
                    (() => {
                      if (isFocusedBatchesPool) {
                        return (
                          <Action
                            disabled
                            message={
                              <FormattedMessage
                                id="modules.Shipments.cantMove"
                                defaultMessage="CAN NOT MOVE TO ORIGIN"
                              />
                            }
                          />
                        );
                      }
                      if (selectedBatches.length === 0) {
                        return (
                          <Action
                            disabled
                            message={
                              <FormattedMessage
                                id="modules.Shipments.selectBatchesFirst"
                                defaultMessage="PLEASE SELECT SOME BATCHES FIRST"
                              />
                            }
                          />
                        );
                      }

                      if (isFocusedContainer) {
                        return (
                          <Action
                            onClick={() => {
                              const newBatches = batches.map(({ id, container, ...rest }) =>
                                includesById(id, selectedBatches)
                                  ? {
                                      id,
                                      ...rest,
                                    }
                                  : {
                                      id,
                                      container,
                                      ...rest,
                                    }
                              );
                              setBatchesState('batches', newBatches);
                              // must first batches, second containers
                              setDeepFieldValue(
                                `containers.${focusedContainerIndex}`,
                                getNewSourceContainer(
                                  containers[focusedContainerIndex],
                                  selectedBatches
                                )
                              );
                              onChangeSelectMode(false);
                              changeContainerIdToExistingBatches(selectedBatches, null);
                            }}
                            message={
                              <FormattedMessage
                                id="modules.Shipments.moveToBatchesPool"
                                defaultMessage="MOVE TO BATCHES POOL"
                              />
                            }
                          />
                        );
                      }
                      return null;
                    })()}
                </div>
                {containers.map((container, index) => {
                  const isSelected = focusedContainerIndex === index;

                  return (
                    <div key={container.id} className={SelectContainerCardWrapperStyle}>
                      {isSelectBatchesMode ? (
                        <>
                          <ShipmentContainerCard container={container} />
                          {(() => {
                            if (isFocusedContainer && isSelected) {
                              return (
                                <Action
                                  disabled
                                  message={
                                    <FormattedMessage
                                      id="modules.Shipments.cantMove"
                                      defaultMessage="CAN NOT MOVE TO ORIGIN"
                                    />
                                  }
                                />
                              );
                            }
                            if (selectedBatches.length === 0) {
                              return (
                                <Action
                                  disabled
                                  message={
                                    <FormattedMessage
                                      id="modules.Shipments.selectBatchesFirst"
                                      defaultMessage="PLEASE SELECT SOME BATCHES FIRST"
                                    />
                                  }
                                />
                              );
                            }
                            return (
                              <Action
                                onClick={() => {
                                  const newBatches = batches.map(
                                    ({ id, container: currentContainer, ...rest }) => ({
                                      id,
                                      ...(includesById(id, selectedBatches)
                                        ? { container }
                                        : { container: currentContainer }),
                                      ...rest,
                                    })
                                  );
                                  setBatchesState('batches', newBatches);
                                  if (isFocusedBatchesPool) {
                                    setDeepFieldValue(`containers.${index}`, {
                                      ...container,
                                      ...(container.batches.length === 0
                                        ? {
                                            representativeBatch: selectedBatches[0],
                                          }
                                        : {}),
                                      batches: [...container.batches, ...selectedBatches],
                                    });
                                  } else if (isFocusedContainer) {
                                    const sourceContainer = containers[focusedContainerIndex];
                                    setDeepFieldValue(
                                      `containers.${focusedContainerIndex}`,
                                      getNewSourceContainer(sourceContainer, selectedBatches)
                                    );

                                    setDeepFieldValue(`containers.${index}`, {
                                      ...container,
                                      ...(container.batches.length === 0
                                        ? {
                                            representativeBatch: selectedBatches[0],
                                          }
                                        : {}),
                                      batches: [...container.batches, ...selectedBatches],
                                    });
                                  }
                                  onChangeSelectMode(false);
                                  changeContainerIdToExistingBatches(selectedBatches, container);
                                }}
                                message={
                                  <FormattedMessage
                                    id="modules.Shipments.moveToContainer"
                                    defaultMessage="MOVE TO THIS CONTAINER"
                                  />
                                }
                              />
                            );
                          })()}
                        </>
                      ) : (
                        <>
                          <button
                            className={SelectContainerCardBackgroundStyle(isSelected)}
                            type="button"
                            onClick={() => {
                              if (!isSelected) {
                                onSelect(index);
                              } else {
                                onDeselect();
                              }
                            }}
                          >
                            <div className={EyeballIconStyle}>
                              <Icon icon={isSelected ? 'INVISIBLE' : 'VISIBLE'} />
                            </div>
                          </button>
                          <BooleanValue>
                            {({ value: isOpenContainerForm, set: toggleContainerForm }) => (
                              <>
                                <BooleanValue>
                                  {({
                                    value: isOpenSelectWarehouse,
                                    set: toggleSelectWarehouse,
                                  }) => (
                                    <>
                                      <BooleanValue>
                                        {({ value: isOpenDialog, set: toggleDialog }) => (
                                          <>
                                            <ShipmentContainerCard
                                              container={container}
                                              editable={{
                                                no: hasPermission([
                                                  CONTAINER_UPDATE,
                                                  CONTAINER_SET_NO,
                                                ]),
                                                containerType: hasPermission([
                                                  CONTAINER_UPDATE,
                                                  CONTAINER_SET_CONTAINER_TYPE,
                                                ]),
                                                containerOption: hasPermission([
                                                  CONTAINER_UPDATE,
                                                  CONTAINER_SET_CONTAINER_OPTION,
                                                ]),
                                                warehouse: allowSetWarehouse,
                                                viewWarehouse: hasPermission([WAREHOUSE_FORM]),
                                                warehouseArrivalAgreedDate: hasPermission([
                                                  CONTAINER_UPDATE,
                                                  CONTAINER_SET_AGREE_ARRIVAL_DATE,
                                                ]),
                                                warehouseArrivalAgreedDateApprovedBy: hasPermission(
                                                  [
                                                    CONTAINER_UPDATE,
                                                    CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
                                                  ]
                                                ),
                                                warehouseArrivalActualDate: hasPermission([
                                                  CONTAINER_UPDATE,
                                                  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
                                                ]),
                                                warehouseArrivalActualDateApprovedBy: hasPermission(
                                                  [
                                                    CONTAINER_UPDATE,
                                                    CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
                                                  ]
                                                ),
                                              }}
                                              update={newContainer => {
                                                setDeepFieldValue(
                                                  `containers.${index}`,
                                                  newContainer
                                                );
                                                const newBatches = batches.map(batch => {
                                                  const {
                                                    container: batchContainer,
                                                    ...rest
                                                  } = batch;
                                                  if (
                                                    batchContainer &&
                                                    batchContainer.id === newContainer.id
                                                  ) {
                                                    return {
                                                      ...rest,
                                                      container: newContainer,
                                                    };
                                                  }
                                                  return batch;
                                                });
                                                setBatchesState('batches', newBatches);
                                              }}
                                              onClick={
                                                hasPermission(CONTAINER_FORM)
                                                  ? () => toggleContainerForm(true)
                                                  : null
                                              }
                                              onSelectWarehouse={() => toggleSelectWarehouse(true)}
                                              actions={[
                                                hasPermission(CONTAINER_DELETE) && (
                                                  <CardAction
                                                    icon="REMOVE"
                                                    hoverColor="RED"
                                                    onClick={evt => {
                                                      evt.stopPropagation();
                                                      if (
                                                        container.batches &&
                                                        container.batches.length > 0
                                                      ) {
                                                        toggleDialog(true);
                                                      } else {
                                                        setFieldValue(
                                                          'containers',
                                                          removeContainerById(
                                                            containers,
                                                            container.id
                                                          )
                                                        );
                                                        if (isSelected) onDeselect();
                                                      }
                                                    }}
                                                  />
                                                ),
                                              ].filter(Boolean)}
                                            />
                                            <RemoveContainerConfirmDialog
                                              isOpen={isOpenDialog}
                                              onRequestClose={() => toggleDialog(false)}
                                              onCancel={() => toggleDialog(false)}
                                              permission={{
                                                removeContainer: hasPermission(CONTAINER_DELETE),
                                                removeShipmentBatch:
                                                  hasPermission(CONTAINER_DELETE) &&
                                                  hasPermission(SHIPMENT_REMOVE_BATCH),
                                              }}
                                              onToBatchesPool={() => {
                                                setBatchesState(
                                                  'batches',
                                                  cleanBatchesContainerByContainerId(
                                                    batches,
                                                    container.id
                                                  )
                                                );
                                                setFieldValue(
                                                  'containers',
                                                  removeContainerById(containers, container.id)
                                                );
                                                changeContainerIdToExistingBatches(batches, null);
                                                if (isSelected) onDeselect();
                                              }}
                                              onRemove={() => {
                                                setBatchesState(
                                                  'batches',
                                                  removeBatchesByContainerId(batches, container.id)
                                                );
                                                setFieldValue(
                                                  'containers',
                                                  removeContainerById(containers, container.id)
                                                );
                                                removeExistingBatches(container.batches);
                                                if (isSelected) onDeselect();
                                              }}
                                            />
                                          </>
                                        )}
                                      </BooleanValue>
                                      <SlideView
                                        isOpen={isOpenSelectWarehouse}
                                        onRequestClose={() => toggleSelectWarehouse(false)}
                                      >
                                        {isOpenSelectWarehouse && (
                                          <SelectWareHouse
                                            selected={container.warehouse}
                                            onCancel={() => toggleSelectWarehouse(false)}
                                            onSelect={newValue => {
                                              toggleSelectWarehouse(false);
                                              setDeepFieldValue(`containers.${index}`, {
                                                ...container,
                                                warehouse: newValue,
                                              });
                                            }}
                                          />
                                        )}
                                      </SlideView>
                                    </>
                                  )}
                                </BooleanValue>
                                <Subscribe to={[ShipmentInfoContainer]}>
                                  {({ state: shipmentInfo }) => (
                                    <SlideView
                                      isOpen={isOpenContainerForm}
                                      onRequestClose={() => toggleContainerForm(false)}
                                      shouldConfirm={() => {
                                        const button = document.getElementById(
                                          'container_form_save_button'
                                        );
                                        return button;
                                      }}
                                    >
                                      {isOpenContainerForm && (
                                        <ContainerFormInSlide
                                          isNew={container.id.includes('-')}
                                          container={{
                                            ...container,
                                            shipment: container.shipment
                                              ? { ...container.shipment, ...shipmentInfo }
                                              : shipmentInfo,
                                          }}
                                          onSave={newContainer => {
                                            const { batches: newBatches } = newContainer;
                                            setBatchesState('batches', [
                                              ...batches.filter(
                                                ({ container: batchContainer }) =>
                                                  isNullOrUndefined(batchContainer) ||
                                                  batchContainer.id !== container.id
                                              ),
                                              ...newBatches.map(batch => ({
                                                ...batch,
                                                container: newContainer,
                                              })),
                                            ]);
                                            setDeepFieldValue(`containers.${index}`, newContainer);
                                            toggleContainerForm(false);
                                          }}
                                        />
                                      )}
                                    </SlideView>
                                  )}
                                </Subscribe>
                              </>
                            )}
                          </BooleanValue>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={ContainersFooterWrapperStyle}>
              {!isSelectBatchesMode && hasPermission([CONTAINER_CREATE]) && (
                <NewButton
                  label={
                    <FormattedMessage
                      id="modules.Shipments.newContainer"
                      defaultMessage="NEW CONTAINER"
                    />
                  }
                  onClick={() => {
                    const clonedContainers = containers.slice(0);
                    if (containers.length === 0) {
                      setTimelineState('containerGroups.0.warehouse', null);
                      setTimelineState('containerGroups.0.warehouseArrival', {});
                      setTimeout(() => {
                        emitter.emit('AUTO_DATE');
                      }, 200);
                    }
                    setFieldValue('containers', [
                      ...clonedContainers,
                      {
                        ...generateContainer(),
                        isNew: true,
                        no: `container no ${containers.length + 1}`,
                        freeTimeStartDate:
                          voyages.length === 0
                            ? null
                            : getLatestDate(voyages[voyages.length - 1].arrival),
                        archived: shipmentIsArchived,
                      },
                    ]);
                  }}
                />
              )}
            </div>
          </div>
        );
      }}
    </Subscribe>
  );
}

export default ContainersArea;
