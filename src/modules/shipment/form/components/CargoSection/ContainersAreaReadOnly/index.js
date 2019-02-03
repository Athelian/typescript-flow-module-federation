// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { findIndex } from 'lodash';

import { Subscribe } from 'unstated';
import { getByPath } from 'utils/fp';
import { injectUid } from 'utils/id';

import { NewButton } from 'components/Buttons';
import FormattedNumber from 'components/FormattedNumber';

import {
  ShipmentContainersContainer,
  ShipmentBatchesContainer,
} from 'modules/shipment/form/containers';
import { ShipmentContainerCard, BatchesPoolCard } from 'components/Cards';
import Icon from 'components/Icon';
import {
  isSelectedBatchesPool,
  isSelectedContainer,
  getBatchesInPool,
} from 'modules/shipment/helpers';
import Action from 'modules/shipment/form/components/Action';

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
  ContainersFooterWrapperStyle,
} from './style';

type Props = {
  selectCardId: ?string,
  selectedBatches: Array<Object>,
  setIsSelectBatchesMode: Function,
};

function ContainersArea({ selectCardId, selectedBatches, setIsSelectBatchesMode }: Props) {
  return (
    <Subscribe to={[ShipmentContainersContainer, ShipmentBatchesContainer]}>
      {(
        { state: { containers }, setFieldValue: setContainers, setDeepFieldValue },
        { state: { batches }, setFieldValue: setBatches }
      ) => {
        const batchesInPool = getBatchesInPool(batches);
        const isSelectedContainerCard = isSelectedContainer(selectCardId);
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
                <div className={SelectBatchesPoolCardWrapperStyle(isSelectedBatchesPool(batches))}>
                  <BatchesPoolCard
                    totalBatches={batchesInPool.length}
                    product={
                      batchesInPool.length > 0
                        ? getByPath('orderItem.productProvider.product', batchesInPool[0])
                        : null
                    }
                  />
                  {isSelectedContainerCard ? (
                    <Action
                      onClick={() => {
                        const newBatches = batches.map(({ id, container, ...rest }) =>
                          selectedBatches.map(({ id: batchId }) => batchId).includes(id)
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
                        const containerIndex = findIndex(
                          containers,
                          ({ id }) => id === selectCardId
                        );
                        const updatedContainerBatches = containers[containerIndex].batches.filter(
                          ({ id }) =>
                            !selectedBatches.map(({ id: batchId }) => batchId).includes(id)
                        );
                        setBatches('batches', newBatches);
                        setDeepFieldValue(
                          `containers.${containerIndex}.batches`,
                          updatedContainerBatches
                        );
                        setIsSelectBatchesMode(false);
                      }}
                      message={
                        <FormattedMessage
                          id="modules.shipment.moveToBatchesPool"
                          defaultMessage="MOVE TO BATCHES POOL"
                        />
                      }
                    />
                  ) : (
                    <Action
                      disabled
                      message={
                        <FormattedMessage
                          id="modules.shipment.cantMove"
                          defaultMessage="CAN NOT MOVE TO HERE"
                        />
                      }
                    />
                  )}
                </div>

                <>
                  {containers.map((container, index) => {
                    return (
                      <div key={container.id} className={SelectContainerCardWrapperStyle}>
                        <ShipmentContainerCard container={container} />
                        {isSelectedContainerCard && selectCardId === container.id ? (
                          <Action
                            disabled
                            message={
                              <FormattedMessage
                                id="modules.shipment.cantMove"
                                defaultMessage="CAN NOT MOVE TO HERE"
                              />
                            }
                          />
                        ) : (
                          <Action
                            onClick={() => {
                              if (isSelectedContainerCard) {
                                const newBatches = batches.map(
                                  ({ id, container: currentContainer, ...rest }) =>
                                    selectedBatches.map(({ id: batchId }) => batchId).includes(id)
                                      ? {
                                          id,
                                          container,
                                          ...rest,
                                        }
                                      : {
                                          id,
                                          container: currentContainer,
                                          ...rest,
                                        }
                                );
                                setBatches('batches', newBatches);

                                const sourceContainerIndex = findIndex(
                                  containers,
                                  ({ id }) => id === selectCardId
                                );
                                const sourceContainerBatches = containers[
                                  sourceContainerIndex
                                ].batches.filter(
                                  ({ id }) =>
                                    !selectedBatches.map(({ id: batchId }) => batchId).includes(id)
                                );

                                setDeepFieldValue(
                                  `containers.${sourceContainerIndex}.batches`,
                                  sourceContainerBatches
                                );
                                setDeepFieldValue(`containers.${index}.batches`, selectedBatches);
                              } else {
                                // TODO:
                                console.log('TODO');
                              }

                              setIsSelectBatchesMode(false);
                            }}
                            message={
                              <FormattedMessage
                                id="modules.shipment.moveToContainer"
                                defaultMessage="MOVE TO CONTAINER"
                              />
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </>
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
                  setContainers('containers', [
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
