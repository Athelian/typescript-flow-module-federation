// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
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
  isFocusedBatchesPool,
  isFocusedContainerCard,
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
  focusedCardIndex: string | number | null,
  selectedBatches: Array<Object>,
  setIsSelectBatchesMode: Function,
};

const includesById = (id: string, batches: Array<Object>): boolean =>
  batches.map(({ id: batchId }) => batchId).includes(id);

const getNewSourceContainer = (
  sourceContainer: Object,
  selectedBatches: Array<Object>
): { batches: Array<Object>, representativeBatch: Object } => {
  const { batches, representativeBatch } = sourceContainer;
  const newBatches = batches.filter(({ id }) => !includesById(id, selectedBatches));
  const newRepresentativeBatch = includesById(representativeBatch.id, newBatches)
    ? { ...representativeBatch }
    : { ...newBatches[0] };
  return { ...sourceContainer, batches: newBatches, representativeBatch: newRepresentativeBatch };
};

function ContainersAreaReadOnly({
  focusedCardIndex,
  selectedBatches,
  setIsSelectBatchesMode,
}: Props) {
  return (
    <Subscribe to={[ShipmentContainersContainer, ShipmentBatchesContainer]}>
      {(
        {
          state: { containers },
          setFieldValue: setContainers,
          setDeepFieldValue: setContainersByPath,
        },
        {
          state: { batches },
          setFieldValue: setBatches,
          changeContainerIdToExistingBatches,
          cleanExistingBatchesByContainerId,
        }
      ) => {
        const batchesInPool = getBatchesInPool(batches);
        const isFocusedBatchesPoolCard = isFocusedBatchesPool(focusedCardIndex);
        const isFocusedContainerCardCard = isFocusedContainerCard(focusedCardIndex);
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
                  (<FormattedNumber value={containers.length} />)
                </div>
              </div>
              <div className={ContainersGridStyle}>
                <div className={SelectBatchesPoolCardWrapperStyle(isFocusedBatchesPoolCard)}>
                  <BatchesPoolCard
                    totalBatches={batchesInPool.length}
                    product={
                      batchesInPool.length > 0
                        ? getByPath('orderItem.productProvider.product', batchesInPool[0])
                        : null
                    }
                  />
                  {(() => {
                    if (isFocusedBatchesPoolCard) {
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

                    if (isFocusedContainerCardCard) {
                      return (
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
                            setBatches('batches', newBatches);

                            const sourceContainer = containers[focusedCardIndex];

                            setContainersByPath(
                              // $FlowFixMe should use is isFocusedContainerCardCard, but flow-typed has a error
                              `containers.${focusedCardIndex}`,
                              getNewSourceContainer(sourceContainer, selectedBatches)
                            );

                            setIsSelectBatchesMode(false);

                            cleanExistingBatchesByContainerId(sourceContainer.id);
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

                <>
                  {containers.map((container, targetContainerIndex) => {
                    return (
                      <div key={container.id} className={SelectContainerCardWrapperStyle}>
                        <ShipmentContainerCard container={container} />
                        {(() => {
                          if (
                            isFocusedContainerCardCard &&
                            focusedCardIndex === targetContainerIndex
                          ) {
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
                                setBatches('batches', newBatches);
                                if (isFocusedBatchesPoolCard) {
                                  setContainersByPath(`containers.${targetContainerIndex}`, {
                                    ...container,
                                    ...(container.batches.length === 0
                                      ? {
                                          representativeBatch: selectedBatches[0],
                                        }
                                      : {}),
                                    batches: [...container.batches, ...selectedBatches],
                                  });
                                } else if (isFocusedContainerCardCard) {
                                  const sourceContainer = containers[focusedCardIndex];
                                  setContainersByPath(
                                    // $FlowFixMe
                                    `containers.${focusedCardIndex}`,
                                    getNewSourceContainer(sourceContainer, selectedBatches)
                                  );

                                  setContainersByPath(`containers.${targetContainerIndex}`, {
                                    ...container,
                                    ...(container.batches.length === 0
                                      ? {
                                          representativeBatch: selectedBatches[0],
                                        }
                                      : {}),
                                    batches: [...container.batches, ...selectedBatches],
                                  });
                                }
                                setIsSelectBatchesMode(false);
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
                    id="modules.Shipments.newContainer"
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

export default ContainersAreaReadOnly;
