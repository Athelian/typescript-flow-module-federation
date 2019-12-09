// @flow
import { ApolloClient } from 'apollo-client';
import { filterAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import type {
  EntityEvent,
  EntityEventChange,
  EntityEventHandler,
} from 'components/Sheet/SheetLive/types';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import { handleFieldValueEvent } from 'modules/sheet/common/handler';
import { handleOrderChanges } from 'modules/sheet/order/handler';
import { handleOrderItemChanges } from 'modules/sheet/orderItem/handler';
import { handleBatchChanges } from 'modules/sheet/batch/handler';
import { handleProductChanges } from 'modules/sheet/product/handler';
import {
  handleContainerGroupChanges,
  handleShipmentChanges,
  handleTimelineDateChanges,
  handleVoyageChanges,
} from 'modules/sheet/shipment/handler';
import { handleContainerChanges } from 'modules/sheet/container/handler';
import { decorateContainer, decorateBatch } from './decorator';
import { batchByIDQuery, containerByIDQuery, orderByIDQuery, orderItemByIDQuery } from './query';

function onCreateContainerFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return (containerId: string) =>
    client
      .query({
        query: containerByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: containerId,
        },
      })
      .then(({ data }) => {
        const newContainer = data?.container;
        if (newContainer?.__typename !== 'Container') {
          return;
        }

        dispatch({
          type: Actions.PRE_ADD_ENTITY,
          payload: {
            entity: {
              id: containerId,
              type: 'Container',
            },
            callback: (shipments: Array<Object>) => {
              const shipmentId = newContainer.shipment?.id;
              if (!shipmentId) {
                return null;
              }

              const shipmentIdx = shipments.findIndex(shipment => shipment.id === shipmentId);
              if (shipmentIdx === -1) {
                return null;
              }

              const containers = [...shipments[shipmentIdx].containers];
              containers.splice(newContainer.sort, 0, decorateContainer(newContainer));

              return {
                item: {
                  ...shipments[shipmentIdx],
                  containers,
                },
                index: shipmentIdx,
              };
            },
          },
        });
      });
}

function onCreateBatchFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return (batchId: string) =>
    client
      .query({
        query: batchByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: batchId,
        },
      })
      .then(({ data }) => {
        const newBatch = data?.batch;
        if (newBatch?.__typename !== 'Batch') {
          return;
        }

        dispatch({
          type: Actions.PRE_ADD_ENTITY,
          payload: {
            entity: {
              id: batchId,
              type: 'Batch',
            },
            callback: (shipments: Array<Object>) => {
              const shipmentId = newBatch.shipment?.id;
              const containerId = newBatch.container?.id;
              if (!shipmentId) {
                return null;
              }

              const shipmentIdx = shipments.findIndex(shipment => shipment.id === shipmentId);
              if (shipmentIdx === -1) {
                return null;
              }

              if (containerId) {
                const containerIdx = shipments[shipmentIdx].containers.findIndex(
                  container => container.id === containerId
                );

                if (containerIdx === -1) {
                  return null;
                }

                const containers = [...shipments[shipmentIdx].containers];
                const batches = [...containers[containerIdx].batches];

                batches.splice(newBatch.containerSort, 0, decorateBatch(newBatch));

                containers[containerIdx] = {
                  ...containers[containerIdx],
                  batches,
                };

                return {
                  item: {
                    ...shipments[shipmentIdx],
                    containers,
                  },
                  index: shipmentIdx,
                };
              }

              const batches = [...shipments[shipmentIdx].batchesWithoutContainer];

              batches.splice(newBatch.shipmentSort, 0, decorateBatch(newBatch));

              return {
                item: {
                  ...shipments[shipmentIdx],
                  batchesWithoutContainer: batches,
                },
                index: shipmentIdx,
              };
            },
          },
        });
      });
}

function onUpdateBatchOrderItemFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return async (batchId: string, orderItemId: string | null) => {
    await client
      .query({
        query: orderItemByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: orderItemId,
        },
      })
      .then(({ data }) => {
        const orderItem = data?.orderItem;
        if (orderItem?.__typename !== 'OrderItem') {
          return;
        }

        dispatch({
          type: Actions.REPLACE_ITEM,
          payload: {
            callback: (shipments: Array<Object>) => {
              let shipmentIdx = shipments.findIndex(shipment =>
                shipment.batchesWithoutContainer.some(b => b.id === batchId)
              );
              if (shipmentIdx >= 0) {
                const batches = [...shipments[shipmentIdx].batchesWithoutContainer];
                const batchIdx = batches.findIndex(b => b.id === batchId);

                batches[batchIdx] = {
                  ...batches[batchIdx],
                  orderItem,
                };

                return {
                  item: {
                    ...shipments[shipmentIdx],
                    batchesWithoutContainer: batches,
                  },
                  index: shipmentIdx,
                };
              }

              shipmentIdx = shipments.findIndex(shipment =>
                shipment.containers.some(c => c.batches.some(b => b.id === batchId))
              );
              if (shipmentIdx < 0) {
                return null;
              }

              const containers = [...shipments[shipmentIdx].containers];
              const containerIdx = containers.findIndex(c => c.batches.some(b => b.id === batchId));
              if (containerIdx < 0) {
                return null;
              }

              const batches = [...containers[containerIdx].batches];
              const batchIdx = batches.findIndex(b => b.id === batchId);
              if (batchIdx < 0) {
                return null;
              }

              batches[batchIdx] = {
                ...batches[batchIdx],
                orderItem,
              };
              containers[containerIdx] = {
                ...containers[containerIdx],
                batches,
              };

              return {
                item: {
                  ...shipments[shipmentIdx],
                  containers,
                },
                index: shipmentIdx,
              };
            },
          },
        });
      });
  };
}

function onUpdateBatchOrderItemOrderFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return async (batchId: string, orderId: string | null) => {
    await client
      .query({
        query: orderByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: orderId,
        },
      })
      .then(({ data }) => {
        const order = data?.order;
        if (order?.__typename !== 'Order') {
          return;
        }

        dispatch({
          type: Actions.REPLACE_ITEM,
          payload: {
            callback: (shipments: Array<Object>) => {
              let shipmentIdx = shipments.findIndex(shipment =>
                shipment.batchesWithoutContainer.some(b => b.id === batchId)
              );
              if (shipmentIdx >= 0) {
                const batches = [...shipments[shipmentIdx].batchesWithoutContainer];
                const batchIdx = batches.findIndex(b => b.id === batchId);

                batches[batchIdx] = {
                  ...batches[batchIdx],
                  orderItem: {
                    ...batches[batchIdx].orderItem,
                    order,
                  },
                };

                return {
                  item: {
                    ...shipments[shipmentIdx],
                    batchesWithoutContainer: batches,
                  },
                  index: shipmentIdx,
                };
              }

              shipmentIdx = shipments.findIndex(shipment =>
                shipment.containers.some(c => c.batches.some(b => b.id === batchId))
              );
              if (shipmentIdx < 0) {
                return null;
              }

              const containers = [...shipments[shipmentIdx].containers];
              const containerIdx = containers.findIndex(c => c.batches.some(b => b.id === batchId));
              if (containerIdx < 0) {
                return null;
              }

              const batches = [...containers[containerIdx].batches];
              const batchIdx = batches.findIndex(b => b.id === batchId);
              if (batchIdx < 0) {
                return null;
              }

              batches[batchIdx] = {
                ...batches[batchIdx],
                orderItem: {
                  ...batches[batchIdx].orderItem,
                  order,
                },
              };
              containers[containerIdx] = {
                ...containers[containerIdx],
                batches,
              };

              return {
                item: {
                  ...shipments[shipmentIdx],
                  containers,
                },
                index: shipmentIdx,
              };
            },
          },
        });
      });
  };
}

function onDeleteContainerFactory(dispatch: Action => void) {
  return (containerId: string) => {
    dispatch({
      type: Actions.PRE_REMOVE_ENTITY,
      payload: {
        entity: {
          id: containerId,
          type: 'Container',
        },
        callback: (shipments: Array<Object>) => {
          const shipmentIdx = shipments.findIndex(
            shipment => !!shipment.containers.find(container => container.id === containerId)
          );
          if (shipmentIdx === -1) {
            return null;
          }

          return {
            item: {
              ...shipments[shipmentIdx],
              containers: shipments[shipmentIdx].containers.filter(
                container => container.id !== containerId
              ),
            },
            index: shipmentIdx,
          };
        },
      },
    });
  };
}

function onDeleteBatchFactory(dispatch: Action => void) {
  return (batchId: string, newShipmentId: ?string = null) => {
    dispatch({
      type: Actions.PRE_REMOVE_ENTITY,
      payload: {
        entity: {
          id: batchId,
          type: 'Batch',
        },
        callback: (shipments: Array<Object>) => {
          const shipmentIdx = shipments.findIndex(
            s =>
              s.id !== newShipmentId &&
              (s.batchesWithoutContainer.some(b => b.id === batchId) ||
                s.containers.some(c => c.batches.some(b => b.id === batchId)))
          );
          if (shipmentIdx === -1) {
            return null;
          }

          return {
            item: {
              ...shipments[shipmentIdx],
              batchesWithoutContainer: shipments[shipmentIdx].batchesWithoutContainer.filter(
                batch => batch.id !== batchId
              ),
              containers: shipments[shipmentIdx].containers.map(container => ({
                ...container,
                batches: container.batches.filter(batch => batch.id !== batchId),
              })),
            },
            index: shipmentIdx,
          };
        },
      },
    });
  };
}

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const onCreateContainer = onCreateContainerFactory(client, dispatch);
  const onCreateBatch = onCreateBatchFactory(client, dispatch);
  const onUpdateBatchOrderItem = onUpdateBatchOrderItemFactory(client, dispatch);
  const onUpdateBatchOrderItemOrder = onUpdateBatchOrderItemOrderFactory(client, dispatch);
  const onDeleteContainer = onDeleteContainerFactory(dispatch);
  const onDeleteBatch = onDeleteBatchFactory(dispatch);

  return async (event: EntityEvent, shipments: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'Container': {
            await onCreateContainer(event.entity.id);
            break;
          }
          case 'Batch':
            await onCreateBatch(event.entity.id);
            break;
          default:
            break;
        }
        break;
      case 'Update': {
        let { changes } = event;

        switch (event.entity.__typename) {
          case 'Shipment': {
            changes = await handleShipmentChanges(
              client,
              changes,
              shipments.find(s => s.id === event.entity?.id)
            );
            break;
          }
          case 'TimelineDate': {
            const shipment = shipments.find(s => {
              if (
                s.cargoReady.id === event.entity?.id ||
                s.containerGroups[0].customClearance.id === event.entity?.id ||
                s.containerGroups[0].warehouseArrival.id === event.entity?.id ||
                s.containerGroups[0].deliveryReady.id === event.entity?.id
              ) {
                return true;
              }

              return !!s.voyages.find(
                voyage =>
                  voyage.departure.id === event.entity?.id || voyage.arrival.id === event.entity?.id
              );
            });
            changes = await handleTimelineDateChanges(client, changes, event.entity.id, shipment);
            break;
          }
          case 'Voyage':
            changes = handleVoyageChanges(changes);
            break;
          case 'ContainerGroup':
            changes = await handleContainerGroupChanges(client, changes);
            break;
          case 'Container': {
            const container = shipments
              .flatMap(shipment => shipment.containers)
              .find(c => c.id === event.entity?.id);
            changes = await handleContainerChanges(client, changes, container);
            break;
          }
          case 'Batch': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'orderItem':
                  await onUpdateBatchOrderItem(event.entity.id, change.new?.entity?.id ?? null);
                  return false;
                case 'container':
                case 'shipment':
                  onDeleteBatch(event.entity.id, change.new?.entity?.id ?? null);
                  await onCreateBatch(event.entity.id);
                  return false;
                default:
                  return true;
              }
            });

            const batch = shipments
              .flatMap(shipment => [
                ...shipment.batchesWithoutContainer,
                ...shipment.containers.flatMap(c => c.batches),
              ])
              .find(b => b.id === event.entity.id);
            changes = await handleBatchChanges(client, changes, batch);
            break;
          }
          case 'OrderItem': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'order':
                  await onUpdateBatchOrderItemOrder(
                    event.entity.id,
                    change.new?.entity?.id ?? null
                  );
                  return false;
                default:
                  return true;
              }
            });
            changes = await handleOrderItemChanges(client, changes);
            break;
          }
          case 'Order':
            changes = await handleOrderChanges(client, changes);
            break;
          case 'Product':
            changes = await handleProductChanges(client, changes);
            break;
          case 'FieldValue':
            handleFieldValueEvent(dispatch, event);
            return;
          default:
            break;
        }

        if (changes.length > 0) {
          dispatch({
            type: Actions.CHANGE_VALUES,
            payload: {
              changes: changes.map(change => {
                return defaultEntityEventChangeTransformer(event, change);
              }),
            },
          });
        }
        break;
      }
      case 'Delete':
        switch (event.entity.__typename) {
          case 'Container':
            onDeleteContainer(event.entity.id);
            break;
          case 'Batch':
            onDeleteBatch(event.entity.id);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
}
