// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { SHIPMENT_UPDATE, SHIPMENT_REMOVE_BATCH } from 'modules/permission/constants/shipment';
import {
  CONTAINER_CREATE,
  CONTAINER_SET_WAREHOUSE,
  CONTAINER_UPDATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
} from 'modules/permission/constants/container';
import { getByPath, isNullOrUndefined } from 'utils/fp';
import { injectUid } from 'utils/id';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import ContainerFormContainer from 'modules/container/form/container';
import {
  ShipmentContainersContainer,
  ShipmentBatchesContainer,
} from 'modules/shipment/form/containers';
import { WAREHOUSE_FORM } from 'modules/permission/constants/warehouse';
import { ShipmentContainerCard, CardAction, BatchesPoolCard } from 'components/Cards';
import Icon from 'components/Icon';
import { BATCHES_POOL, isSelectedBatchesPool, getBatchesInPool } from 'modules/shipment/helpers';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import ContainerFormInSlide from 'modules/container/index.form.slide';
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
  selectCardId: ?string,
  setSelected: ({ cardId: string, containerIndex: number }) => void,
};

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

function ContainersArea({ selectCardId, setSelected }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  return (
    <Subscribe to={[ShipmentContainersContainer, ShipmentBatchesContainer]}>
      {(
        {
          originalValues: containersOriginalValues,
          state: containersState,
          setFieldValue,
          setDeepFieldValue,
        },
        { state: { batches }, setFieldValue: updateBatchesState }
      ) => {
        const batchesInPool = getBatchesInPool(batches);

        const { containers } = { ...containersOriginalValues, ...containersState };
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
                  className={SelectBatchesPoolCardWrapperStyle(isSelectedBatchesPool(selectCardId))}
                  role="presentation"
                  onClick={() => setSelected({ cardId: BATCHES_POOL, containerIndex: -1 })}
                >
                  <div className={EyeballIconStyle}>
                    <Icon icon={isSelectedBatchesPool(selectCardId) ? 'INVISIBLE' : 'VISIBLE'} />
                  </div>
                  <BatchesPoolCard
                    totalBatches={batchesInPool.length}
                    product={
                      batchesInPool.length > 0
                        ? getByPath('orderItem.productProvider.product', batchesInPool[0])
                        : null
                    }
                  />
                </div>
                {containers.map((container, position) => {
                  const isSelected = selectCardId === container.id;

                  return (
                    <div key={container.id} className={SelectContainerCardWrapperStyle}>
                      <button
                        className={SelectContainerCardBackgroundStyle(isSelected)}
                        type="button"
                        onClick={() =>
                          setSelected({ cardId: container.id, containerIndex: position })
                        }
                      >
                        <div className={EyeballIconStyle}>
                          <Icon icon={isSelected ? 'INVISIBLE' : 'VISIBLE'} />
                        </div>
                      </button>
                      <BooleanValue>
                        {({ value: isOpenContainerForm, set: toggleContainerForm }) => (
                          <>
                            <BooleanValue>
                              {({ value: isOpenSelectWarehouse, set: toggleSelectWarehouse }) => (
                                <>
                                  <BooleanValue>
                                    {({ value: isOpenDialog, set: toggleDialog }) => (
                                      <>
                                        {/* TODO: check same todo written for ContainersSlideView */}
                                        <ShipmentContainerCard
                                          container={container}
                                          editable={{
                                            no: hasPermission([
                                              SHIPMENT_UPDATE,
                                              CONTAINER_UPDATE,
                                              CONTAINER_SET_NO,
                                            ]),
                                            warehouse: hasPermission([
                                              SHIPMENT_UPDATE,
                                              CONTAINER_UPDATE,
                                              CONTAINER_SET_WAREHOUSE,
                                            ]),
                                            viewWarehouse: hasPermission([
                                              SHIPMENT_UPDATE,
                                              WAREHOUSE_FORM,
                                            ]),
                                            warehouseArrivalAgreedDate: hasPermission([
                                              SHIPMENT_UPDATE,
                                              CONTAINER_UPDATE,
                                              CONTAINER_SET_AGREE_ARRIVAL_DATE,
                                            ]),
                                            warehouseArrivalAgreedDateApprovedBy: hasPermission([
                                              SHIPMENT_UPDATE,
                                              CONTAINER_UPDATE,
                                              CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
                                            ]),
                                            warehouseArrivalActualDate: hasPermission([
                                              SHIPMENT_UPDATE,
                                              CONTAINER_UPDATE,
                                              CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
                                            ]),
                                            warehouseArrivalActualDateApprovedBy: hasPermission([
                                              SHIPMENT_UPDATE,
                                              CONTAINER_UPDATE,
                                              CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
                                            ]),
                                          }}
                                          update={newContainer => {
                                            setDeepFieldValue(
                                              `containers.${position}`,
                                              newContainer
                                            );
                                          }}
                                          // TODO: add perm to check containers.form
                                          onClick={() => toggleContainerForm(true)}
                                          onSelectWarehouse={
                                            hasPermission([
                                              SHIPMENT_UPDATE,
                                              CONTAINER_SET_WAREHOUSE,
                                            ])
                                              ? () => toggleSelectWarehouse(true)
                                              : () => {}
                                          }
                                          actions={[
                                            // TODO: (shipment_update || shipment.container.remove ) && container.container.delete
                                            hasPermission([SHIPMENT_UPDATE, CONTAINER_UPDATE]) && (
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
                                                      removeContainerById(containers, container.id)
                                                    );
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
                                          removable={hasPermission([
                                            SHIPMENT_UPDATE,
                                            SHIPMENT_REMOVE_BATCH,
                                          ])}
                                          // TODO: add prop for To Batches Pool, check shipment.containerBatches.remove
                                          onToBatchesPool={() => {
                                            updateBatchesState(
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
                                          }}
                                          onRemove={() => {
                                            updateBatchesState(
                                              'batches',
                                              removeBatchesByContainerId(batches, container.id)
                                            );
                                            setFieldValue(
                                              'containers',
                                              removeContainerById(containers, container.id)
                                            );
                                          }}
                                        />
                                      </>
                                    )}
                                  </BooleanValue>
                                  <SlideView
                                    isOpen={isOpenSelectWarehouse}
                                    onRequestClose={() => toggleSelectWarehouse(false)}
                                    options={{ width: '1030px' }}
                                  >
                                    {isOpenSelectWarehouse && (
                                      <SelectWareHouse
                                        selected={container.warehouse}
                                        onCancel={() => toggleSelectWarehouse(false)}
                                        onSelect={newValue => {
                                          toggleSelectWarehouse(false);
                                          setDeepFieldValue(`containers.${position}`, {
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
                            {/* TODO: need container.form to open slideview */}
                            <SlideView
                              isOpen={isOpenContainerForm}
                              onRequestClose={() => toggleContainerForm(false)}
                              options={{ width: '1030px' }}
                            >
                              {isOpenContainerForm && (
                                <Subscribe to={[ContainerFormContainer]}>
                                  {({ initDetailValues }) => (
                                    <ContainerFormInSlide
                                      container={container}
                                      onCancel={() => toggleContainerForm(false)}
                                      onSave={newContainer => {
                                        const { batches: newBatches } = newContainer;
                                        updateBatchesState('batches', [
                                          ...batches,
                                          ...newBatches.map(batch => ({
                                            ...batch,
                                            container,
                                          })),
                                        ]);
                                        setDeepFieldValue(`containers.${position}`, newContainer);
                                        toggleContainerForm(false);
                                      }}
                                      onFormReady={() => initDetailValues(container)}
                                    />
                                  )}
                                </Subscribe>
                              )}
                            </SlideView>
                          </>
                        )}
                      </BooleanValue>
                    </div>
                  );
                })}
              </div>
            </div>
            {hasPermission([CONTAINER_CREATE]) && (
              <div className={ContainersFooterWrapperStyle}>
                <NewButton
                  label={
                    <FormattedMessage
                      id="modules.Shipments.newContainer"
                      defaultMessage="NEW CONTAINER"
                    />
                  }
                  onClick={() => {
                    const clonedContainers = containers.slice(0);
                    setFieldValue('containers', [
                      ...clonedContainers,
                      injectUid({
                        no: `container no ${containers.length + 1}`,
                        isNew: true,
                        batches: [],
                        tags: [],
                        totalVolume: {
                          metric: 'm³',
                          value: 0,
                        },
                        totalWeight: {
                          metric: 'kg',
                          value: 0,
                        },
                        totalBatchQuantity: 0,
                        totalBatchPackages: 0,
                        totalNumberOfUniqueOrderItems: 0,
                        warehouseArrivalActualDateAssignedTo: [],
                        warehouseArrivalAgreedDateAssignedTo: [],
                      }),
                    ]);
                  }}
                />
              </div>
            )}
          </div>
        );
      }}
    </Subscribe>
  );
}

export default ContainersArea;
