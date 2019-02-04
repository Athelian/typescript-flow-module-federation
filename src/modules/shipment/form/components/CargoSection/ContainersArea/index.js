// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Subscribe } from 'unstated';
import { getByPath } from 'utils/fp';
import { injectUid } from 'utils/id';
import SlideView from 'components/SlideView';
import { NewButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';
import ContainerFormContainer from 'modules/container/form/container';
import {
  ShipmentContainersContainer,
  ShipmentBatchesContainer,
} from 'modules/shipment/form/containers';
import { ShipmentContainerCard, CardAction, BatchesPoolCard } from 'components/Cards';
import Icon from 'components/Icon';
import { BATCHES_POOL, isSelectedBatchesPool, getBatchesInPool } from 'modules/shipment/helpers';
import SelectWareHouse from 'modules/warehouse/common/SelectWareHouse';
import ContainerFormInSlide from 'modules/container/index.form.slide';

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

function ContainersArea({ selectCardId, setSelected }: Props) {
  return (
    <Subscribe to={[ShipmentContainersContainer, ShipmentBatchesContainer]}>
      {(
        { state: { containers }, setFieldValue, setDeepFieldValue },
        { state: { batches }, setFieldValue: updateBatchesState }
      ) => {
        const batchesInPool = getBatchesInPool(batches);

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
                                  <ShipmentContainerCard
                                    container={container}
                                    update={newContainer => {
                                      setDeepFieldValue(`containers.${position}`, newContainer);
                                    }}
                                    onClick={() => toggleContainerForm(true)}
                                    onSelectWarehouse={() => toggleSelectWarehouse(true)}
                                    actions={[
                                      <CardAction
                                        icon="REMOVE"
                                        hoverColor="RED"
                                        onClick={() => {
                                          setFieldValue(
                                            'containers',
                                            containers.filter(
                                              ({ id: containerId }) => container.id !== containerId
                                            )
                                          );
                                        }}
                                      />,
                                    ]}
                                  />
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
            <div className={ContainersFooterWrapperStyle}>
              <NewButton
                label={
                  <FormattedMessage
                    id="modules.shipment.newContainer"
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
          </div>
        );
      }}
    </Subscribe>
  );
}

export default ContainersArea;
