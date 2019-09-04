// @flow
import ApolloClient from 'apollo-client';
import { filterAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState';
import { Actions } from 'components/Sheet/SheetState/contants';
import type {
  EntityEvent,
  EntityEventChange,
  EntityEventHandler,
} from 'components/Sheet/SheetLive/entity';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import { batchByIDQuery, containerByIDQuery, orderItemByIDQuery, shipmentByIDQuery } from './query';

// $FlowFixMe not compatible with hook implementation
function addOrderItemFactory(client: ApolloClient, dispatch: Action => void) {
  return async (orderItemId: string) => {
    await client
      .query({
        query: orderItemByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: orderItemId,
        },
      })
      .then(({ data }) => {
        const newOrderItem = data?.orderItem;
        if (newOrderItem.__typename !== 'OrderItem') {
          return;
        }

        dispatch({
          type: Actions.ADDED_ROWS_OF_ENTITY,
          payload: {
            entity: {
              id: orderItemId,
              type: 'OrderItem',
            },
            onAdd: (d: Action => void, items: Array<Object>) => {
              console.log('onAdd', 'orderItem');
              const orderId = newOrderItem.order?.id;
              if (!orderId) {
                console.log('order id');
                return;
              }

              const itemIdx = items.findIndex(item => item.id === orderId);
              if (itemIdx === -1) {
                console.log('order not found');
                return;
              }

              const orderItems = [...items[itemIdx].orderItems];
              orderItems.splice(newOrderItem.sort, 0, newOrderItem);

              d({
                type: Actions.REPLACE_ITEM,
                payload: {
                  item: {
                    ...items[itemIdx],
                    orderItems,
                  },
                  index: itemIdx,
                },
              });
            },
          },
        });
      });
  };
}

// $FlowFixMe not compatible with hook implementation
function addBatchFactory(client: ApolloClient, dispatch: Action => void) {
  return async (batchId: string) => {
    await client
      .query({
        query: batchByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: batchId,
        },
      })
      .then(({ data }) => {
        const newBatch = data?.batch;
        if (newBatch.__typename !== 'Batch') {
          return;
        }

        dispatch({
          type: Actions.ADDED_ROWS_OF_ENTITY,
          payload: {
            entity: {
              id: batchId,
              type: 'Batch',
            },
            onAdd: (d: Action => void, items: Array<Object>) => {
              const orderItemId = newBatch.orderItem?.id;
              const orderId = newBatch.orderItem?.order?.id;
              if (!orderItemId || !orderId) {
                return;
              }

              const itemIdx = items.findIndex(item => item.id === orderId);
              if (itemIdx === -1) {
                return;
              }

              const orderItemIdx = items[itemIdx].orderItems.findIndex(
                orderItem => orderItem.id === orderItemId
              );
              if (orderItemIdx === -1) {
                return;
              }

              const orderItems = [...items[itemIdx].orderItems];
              const batches = [...orderItems[orderItemIdx].batches];
              batches.splice(newBatch.sort, 0, newBatch);
              orderItems[orderItemIdx] = {
                ...orderItems[orderItemIdx],
                batches,
              };

              d({
                type: Actions.REPLACE_ITEM,
                payload: {
                  item: {
                    ...items[itemIdx],
                    orderItems,
                  },
                  index: itemIdx,
                },
              });
            },
          },
        });
      });
  };
}

// $FlowFixMe not compatible with hook implementation
function changeBatchContainerFactory(client: ApolloClient, dispatch: Action => void) {
  function changeContainer(batchId: string, container: Object | null, items: Array<Object>) {
    items.every((item, itemIdx) =>
      item.orderItems.every((orderItem, orderItemIdx) =>
        orderItem.batches.every((batch, batchIdx) => {
          if (batch.id !== batchId) {
            return true;
          }

          const orderItems = [...item.orderItems];
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
                ...item,
                orderItems,
              },
              index: itemIdx,
            },
          });

          return false;
        })
      )
    );
  }

  return async (batchId: string, containerId: string | null, items: Array<Object>) => {
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
          if (container.__typename !== 'Container') {
            return;
          }

          changeContainer(batchId, container, items);
        });
    } else {
      changeContainer(batchId, null, items);
    }
  };
}

// $FlowFixMe not compatible with hook implementation
function changeBatchShipmentFactory(client: ApolloClient, dispatch: Action => void) {
  function changeShipment(batchId: string, shipment: Object | null, items: Array<Object>) {
    items.every((item, itemIdx) =>
      item.orderItems.every((orderItem, orderItemIdx) =>
        orderItem.batches.every((batch, batchIdx) => {
          if (batch.id !== batchId) {
            return true;
          }

          const orderItems = [...item.orderItems];
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
                ...item,
                orderItems,
              },
              index: itemIdx,
            },
          });

          return false;
        })
      )
    );
  }

  return async (batchId: string, shipmentId: string | null, items: Array<Object>) => {
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
          if (shipment.__typename !== 'Shipment') {
            return;
          }

          changeShipment(batchId, shipment, items);
        });
    } else {
      changeShipment(batchId, null, items);
    }
  };
}

function removeOrderFactory(dispatch: Action => void) {
  return function(orderId: string) {
    dispatch({
      type: Actions.REMOVED_ROWS_ENTITY,
      payload: {
        entity: {
          id: orderId,
          type: 'Order',
        },
        onClear: (d: Action => void, items: Array<Object>) => {
          const itemIdx = items.findIndex(item => item.id === orderId);
          if (itemIdx === -1) {
            return;
          }

          d({
            type: Actions.DELETE_ITEM,
            payload: itemIdx,
          });
        },
      },
    });
  };
}

function removeOrderItemFactory(dispatch: Action => void) {
  return function(orderItemId: string) {
    dispatch({
      type: Actions.REMOVED_ROWS_ENTITY,
      payload: {
        entity: {
          id: orderItemId,
          type: 'OrderItem',
        },
        onClear: (d: Action => void, items: Array<Object>) => {
          const itemIdx = items.findIndex(
            item => !!item.orderItems.find(orderItem => orderItem.id === orderItemId)
          );
          if (itemIdx === -1) {
            return;
          }

          d({
            type: Actions.REPLACE_ITEM,
            payload: {
              item: {
                ...items[itemIdx],
                orderItems: items[itemIdx].orderItems.filter(
                  orderItem => orderItem.id !== orderItemId
                ),
              },
              index: itemIdx,
            },
          });
        },
      },
    });
  };
}

function removeBatchFactory(dispatch: Action => void) {
  return function(batchId: string) {
    dispatch({
      type: Actions.REMOVED_ROWS_ENTITY,
      payload: {
        entity: {
          id: batchId,
          type: 'Batch',
        },
        onClear: (d: Action => void, items: Array<Object>) => {
          const itemIdx = items.findIndex(
            item =>
              !!item.orderItems.find(
                orderItem => !!orderItem.batches.find(batch => batch.id === batchId)
              )
          );
          if (itemIdx === -1) {
            return;
          }

          d({
            type: Actions.REPLACE_ITEM,
            payload: {
              item: {
                ...items[itemIdx],
                orderItems: items[itemIdx].orderItems.map(orderItem => ({
                  ...orderItem,
                  batches: orderItem.batches.filter(batch => batch.id !== batchId),
                })),
              },
              index: itemIdx,
            },
          });
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
  const addOrderItem = addOrderItemFactory(client, dispatch);
  const addBatch = addBatchFactory(client, dispatch);
  const changeBatchContainer = changeBatchContainerFactory(client, dispatch);
  const changeBatchShipment = changeBatchShipmentFactory(client, dispatch);
  const removeOrder = removeOrderFactory(dispatch);
  const removeOrderItem = removeOrderItemFactory(dispatch);
  const removeBatch = removeBatchFactory(dispatch);

  return async (event: EntityEvent, items: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'OrderItem': {
            await addOrderItem(event.entity.id);
            break;
          }
          case 'Batch': {
            await addBatch(event.entity.id);
            break;
          }
          default:
            break;
        }
        break;
      case 'Update': {
        let { changes } = event;

        switch (event.entity.__typename) {
          case 'OrderItem': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              if (change.field === 'order') {
                removeOrderItem(event.entity.id);
                await addOrderItem(event.entity.id);

                return false;
              }
              return true;
            });
            break;
          }
          case 'Batch': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'orderItem':
                  removeBatch(event.entity.id);
                  await addBatch(event.entity.id);
                  return false;
                case 'container':
                  await changeBatchContainer(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    items
                  );
                  return false;
                case 'shipment':
                  await changeBatchShipment(event.entity.id, change.new?.entity?.id ?? null, items);
                  return false;
                default:
                  return true;
              }
            });
            break;
          }
          default:
            break;
        }

        if (changes.length > 0) {
          dispatch({
            type: Actions.CHANGE_VALUES,
            payload: changes.map(change => {
              return defaultEntityEventChangeTransformer(event, change);
            }),
          });
        }
        break;
      }
      case 'Delete':
        switch (event.entity.__typename) {
          case 'Order':
            removeOrder(event.entity.id);
            break;
          case 'OrderItem':
            removeOrderItem(event.entity.id);
            break;
          case 'Batch':
            removeBatch(event.entity.id);
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
