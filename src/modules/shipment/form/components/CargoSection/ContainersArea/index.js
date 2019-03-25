// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { SHIPMENT_REMOVE_BATCH } from 'modules/permission/constants/shipment';
import {
  CONTAINER_FORM,
  CONTAINER_CREATE,
  CONTAINER_DELETE,
  CONTAINER_UPDATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_WAREHOUSE,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
} from 'modules/permission/constants/container';
import { getByPath, isNullOrUndefined } from 'utils/fp';
import { generateContainer } from 'utils/data';
import { getLatestDate } from 'utils/shipment';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import ContainerFormContainer from 'modules/container/form/container';
import {
  ShipmentContainersContainer,
  ShipmentBatchesContainer,
  ShipmentTimelineContainer,
} from 'modules/shipment/form/containers';
import { WAREHOUSE_FORM, WAREHOUSE_LIST } from 'modules/permission/constants/warehouse';
import { ShipmentContainerCard, CardAction, BatchesPoolCard } from 'components/Cards';
import Icon from 'components/Icon';
import { BATCHES_POOL, isFocusedBatchesPool, getBatchesInPool } from 'modules/shipment/helpers';
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
  focusedCardIndex: string | number | null,
  setSelected: (cardId: string | number | null) => void,
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

function ContainersArea({ focusedCardIndex, setSelected }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

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
          setFieldValue: updateBatchesState,
          removeExistingBatches,
          changeContainerIdToExistingBatches,
        },
        { state: { voyages } }
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
                  className={SelectBatchesPoolCardWrapperStyle(
                    isFocusedBatchesPool(focusedCardIndex)
                  )}
                  role="presentation"
                  onClick={() => setSelected(BATCHES_POOL)}
                >
                  <div className={EyeballIconStyle}>
                    <Icon icon={isFocusedBatchesPool(focusedCardIndex) ? 'INVISIBLE' : 'VISIBLE'} />
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
                {containers.map((container, index) => {
                  const isSelected = focusedCardIndex === index;

                  return (
                    <div key={container.id} className={SelectContainerCardWrapperStyle}>
                      <button
                        className={SelectContainerCardBackgroundStyle(isSelected)}
                        type="button"
                        onClick={() => setSelected(index)}
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
                                        <ShipmentContainerCard
                                          container={container}
                                          editable={{
                                            no: hasPermission([CONTAINER_UPDATE, CONTAINER_SET_NO]),
                                            warehouse:
                                              hasPermission(WAREHOUSE_LIST) &&
                                              hasPermission([
                                                CONTAINER_UPDATE,
                                                CONTAINER_SET_WAREHOUSE,
                                              ]),
                                            viewWarehouse: hasPermission([WAREHOUSE_FORM]),
                                            warehouseArrivalAgreedDate: hasPermission([
                                              CONTAINER_UPDATE,
                                              CONTAINER_SET_AGREE_ARRIVAL_DATE,
                                            ]),
                                            warehouseArrivalAgreedDateApprovedBy: hasPermission([
                                              CONTAINER_UPDATE,
                                              CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
                                            ]),
                                            warehouseArrivalActualDate: hasPermission([
                                              CONTAINER_UPDATE,
                                              CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
                                            ]),
                                            warehouseArrivalActualDateApprovedBy: hasPermission([
                                              CONTAINER_UPDATE,
                                              CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
                                            ]),
                                          }}
                                          update={newContainer => {
                                            setDeepFieldValue(`containers.${index}`, newContainer);
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
                                                      removeContainerById(containers, container.id)
                                                    );
                                                    if (isSelected) setSelected(null);
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
                                            changeContainerIdToExistingBatches(batches, null);
                                            if (isSelected) setSelected(null);
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
                                            removeExistingBatches(container.batches);
                                            if (isSelected) setSelected(null);
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
                                      onFormReady={() =>
                                        initDetailValues({
                                          ...container,
                                          shipment: {
                                            voyages,
                                          },
                                        })
                                      }
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
                      {
                        ...generateContainer(),
                        no: `container no ${containers.length + 1}`,
                        freeTimeStartDate:
                          voyages.length === 0
                            ? null
                            : getLatestDate(voyages[voyages.length - 1].arrival),
                        shipment: {
                          voyages,
                        },
                      },
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
