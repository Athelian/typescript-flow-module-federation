// @flow
import ApolloClient from 'apollo-client';
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
import { handleContainerChanges } from 'modules/sheet/container/handler';
import {
  handleContainerGroupChanges,
  handleTimelineDateChanges,
  handleVoyageChanges,
  handleShipmentChanges,
} from 'modules/sheet/shipment/handler';
import { batchByIDQuery, containerByIDQuery, orderItemByIDQuery, shipmentByIDQuery } from './query';

function onCreateOrderItemFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return (orderItemId: string) =>
    client
      .query({
        query: orderItemByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: orderItemId,
        },
      })
      .then(({ data }) => {
        const newOrderItem = data?.orderItem;
        if (newOrderItem?.__typename !== 'OrderItem') {
          return;
        }

        dispatch({
          type: Actions.PRE_ADD_ENTITY,
          payload: {
            entity: {
              id: orderItemId,
              type: 'OrderItem',
            },
            callback: (orders: Array<Object>) => {
              const orderId = newOrderItem.order?.id;
              if (!orderId) {
                return null;
              }

              const orderIdx = orders.findIndex(order => order.id === orderId);
              if (orderIdx === -1) {
                return null;
              }

              const orderItems = [...orders[orderIdx].orderItems];
              orderItems.splice(newOrderItem.sort, 0, newOrderItem);

              return {
                item: {
                  ...orders[orderIdx],
                  orderItems,
                },
                index: orderIdx,
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
            callback: (orders: Array<Object>) => {
              const orderItemId = newBatch.orderItem?.id;
              const orderId = newBatch.orderItem?.order?.id;
              if (!orderItemId || !orderId) {
                return null;
              }

              const orderIdx = orders.findIndex(order => order.id === orderId);
              if (orderIdx === -1) {
                return null;
              }

              const orderItemIdx = orders[orderIdx].orderItems.findIndex(
                orderItem => orderItem.id === orderItemId
              );
              if (orderItemIdx === -1) {
                return null;
              }

              const orderItems = [...orders[orderIdx].orderItems];
              const batches = [...orderItems[orderItemIdx].batches];
              batches.splice(newBatch.sort, 0, newBatch);
              orderItems[orderItemIdx] = {
                ...orderItems[orderItemIdx],
                batches,
              };

              return {
                item: {
                  ...orders[orderIdx],
                  orderItems,
                },
                index: orderIdx,
              };
            },
          },
        });
      });
}

function onUpdateBatchContainerFactory(client: ApolloClient<any>, dispatch: Action => void) {
  function changeContainer(batchId: string, container: Object | null, orders: Array<Object>) {
    orders.every((order, orderIdx) =>
      order.orderItems.every((orderItem, orderItemIdx) =>
        orderItem.batches.every((batch, batchIdx) => {
          if (batch.id !== batchId) {
            return true;
          }

          const orderItems = [...order.orderItems];
          const batches = [...orderItem.batches];
          batches[batchIdx] = {
            ...batch,
            container,
          };
          orderItems[orderItemIdx] = {
            ...orderItem,
            batches,
          };

          dispatch({
            type: Actions.REPLACE_ITEM,
            payload: {
              item: {
                ...order,
                orderItems,
              },
              index: orderIdx,
            },
          });

          return false;
        })
      )
    );
  }

  return async (batchId: string, containerId: string | null, orders: Array<Object>) => {
    if (containerId) {
      await client
        .query({
          query: containerByIDQuery,
          fetchPolicy: 'network-only',
          variables: {
            id: containerId,
          },
        })
        .then(({ data }) => {
          const container = data?.container;
          if (container?.__typename !== 'Container') {
            return;
          }

          changeContainer(batchId, container, orders);
        });
    } else {
      changeContainer(batchId, null, orders);
    }
  };
}

function onUpdateBatchShipmentFactory(client: ApolloClient<any>, dispatch: Action => void) {
  function changeShipment(batchId: string, shipment: Object | null, orders: Array<Object>) {
    orders.every((order, orderIdx) =>
      order.orderItems.every((orderItem, orderItemIdx) =>
        orderItem.batches.every((batch, batchIdx) => {
          if (batch.id !== batchId) {
            return true;
          }

          const orderItems = [...order.orderItems];
          const batches = [...orderItem.batches];
          batches[batchIdx] = {
            ...batch,
            shipment,
          };
          orderItems[orderItemIdx] = {
            ...orderItem,
            batches,
          };

          dispatch({
            type: Actions.REPLACE_ITEM,
            payload: {
              item: {
                ...order,
                orderItems,
              },
              index: orderIdx,
            },
          });

          return false;
        })
      )
    );
  }

  return async (batchId: string, shipmentId: string | null, orders: Array<Object>) => {
    if (shipmentId) {
      await client
        .query({
          query: shipmentByIDQuery,
          fetchPolicy: 'network-only',
          variables: {
            id: shipmentId,
          },
        })
        .then(({ data }) => {
          const shipment = data?.shipment;
          if (shipment?.__typename !== 'Shipment') {
            return;
          }

          changeShipment(batchId, shipment, orders);
        });
    } else {
      changeShipment(batchId, null, orders);
    }
  };
}

function onDeleteOrderItemFactory(dispatch: Action => void) {
  return (orderItemId: string) => {
    dispatch({
      type: Actions.PRE_REMOVE_ENTITY,
      payload: {
        entity: {
          id: orderItemId,
          type: 'OrderItem',
        },
        callback: (orders: Array<Object>) => {
          const orderIdx = orders.findIndex(
            order => !!order.orderItems.find(orderItem => orderItem.id === orderItemId)
          );
          if (orderIdx === -1) {
            return null;
          }

          return {
            item: {
              ...orders[orderIdx],
              orderItems: orders[orderIdx].orderItems.filter(
                orderItem => orderItem.id !== orderItemId
              ),
            },
            index: orderIdx,
          };
        },
      },
    });
  };
}

function onDeleteBatchFactory(dispatch: Action => void) {
  return (batchId: string) => {
    dispatch({
      type: Actions.PRE_REMOVE_ENTITY,
      payload: {
        entity: {
          id: batchId,
          type: 'Batch',
        },
        callback: (orders: Array<Object>) => {
          const orderIdx = orders.findIndex(
            order =>
              !!order.orderItems.find(
                orderItem => !!orderItem.batches.find(batch => batch.id === batchId)
              )
          );
          if (orderIdx === -1) {
            return null;
          }

          return {
            item: {
              ...orders[orderIdx],
              orderItems: orders[orderIdx].orderItems.map(orderItem => ({
                ...orderItem,
                batches: orderItem.batches.filter(batch => batch.id !== batchId),
              })),
            },
            index: orderIdx,
          };
        },
      },
    });
  };
}

function isBelongToShipment(shipment: Object, timelineDateId: string) {
  if (
    shipment.cargoReady.id === timelineDateId ||
    shipment.containerGroups[0].customClearance.id === timelineDateId ||
    shipment.containerGroups[0].warehouseArrival.id === timelineDateId ||
    shipment.containerGroups[0].deliveryReady.id === timelineDateId
  ) {
    return true;
  }

  return !!shipment.voyages.find(
    voyage => voyage.departure.id === timelineDateId || voyage.arrival.id === timelineDateId
  );
}

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const onCreateOrderItem = onCreateOrderItemFactory(client, dispatch);
  const onCreateBatch = onCreateBatchFactory(client, dispatch);
  const onUpdateBatchContainer = onUpdateBatchContainerFactory(client, dispatch);
  const onUpdateBatchShipment = onUpdateBatchShipmentFactory(client, dispatch);
  const onDeleteOrderItem = onDeleteOrderItemFactory(dispatch);
  const onDeleteBatch = onDeleteBatchFactory(dispatch);

  return async (event: EntityEvent, orders: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'OrderItem':
            await onCreateOrderItem(event.entity.id);
            break;
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
          case 'Order': {
            changes = await handleOrderChanges(client, changes);
            break;
          }
          case 'OrderItem': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              if (change.field === 'order') {
                onDeleteOrderItem(event.entity.id);
                await onCreateOrderItem(event.entity.id);

                return false;
              }
              return true;
            });

            changes = await handleOrderItemChanges(client, changes);
            break;
          }
          case 'Batch': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'orderItem':
                  onDeleteBatch(event.entity.id);
                  await onCreateBatch(event.entity.id);
                  return false;
                case 'container':
                  await onUpdateBatchContainer(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    orders
                  );
                  return false;
                case 'shipment':
                  await onUpdateBatchShipment(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    orders
                  );
                  return false;
                default:
                  return true;
              }
            });

            const batch = orders
              .flatMap(order => order.orderItems.flatMap(oi => oi.batches))
              .find(b => b.id === event.entity.id);
            changes = await handleBatchChanges(client, changes, batch);
            break;
          }
          case 'Shipment': {
            const shipment = orders
              .flatMap(order => order.orderItems.flatMap(oi => oi.batches))
              .map(b => b.shipment)
              .filter(Boolean)
              .find(s => isBelongToShipment(s, event.entity?.id));
            changes = await handleShipmentChanges(client, changes, shipment);
            break;
          }
          case 'TimelineDate': {
            const shipment = orders
              .flatMap(order => order.orderItems.flatMap(oi => oi.batches))
              .map(b => b.shipment)
              .filter(Boolean)
              .find(s => isBelongToShipment(s, event.entity?.id));
            changes = await handleTimelineDateChanges(client, changes, event.entity.id, shipment);
            break;
          }
          case 'Container': {
            const container = orders
              .flatMap(order => order.orderItems.flatMap(oi => oi.batches))
              .map(b => b.container)
              .filter(Boolean)
              .find(c => c?.id === event.entity?.id);

            changes = await handleContainerChanges(client, changes, container);
            break;
          }
          case 'Voyage':
            changes = handleVoyageChanges(changes);
            break;
          case 'ContainerGroup':
            changes = await handleContainerGroupChanges(client, changes);
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
          case 'OrderItem':
            onDeleteOrderItem(event.entity.id);
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
