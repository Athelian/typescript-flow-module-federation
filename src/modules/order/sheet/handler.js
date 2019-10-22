// @flow
import ApolloClient from 'apollo-client';
import { filterAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/contants';
import type {
  EntityEvent,
  EntityEventChange,
  EntityEventHandler,
} from 'components/Sheet/SheetLive/entity';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import {
  batchByIDQuery,
  batchQuantityRevisionByIDQuery,
  containerByIDQuery,
  orderItemByIDQuery,
  shipmentByIDQuery,
} from './query';

// $FlowFixMe not compatible with hook implementation
function onCreateOrderItemFactory(client: ApolloClient, dispatch: Action => void) {
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
            callback: (items: Array<Object>) => {
              const orderId = newOrderItem.order?.id;
              if (!orderId) {
                return null;
              }

              const itemIdx = items.findIndex(item => item.id === orderId);
              if (itemIdx === -1) {
                return null;
              }

              const orderItems = [...items[itemIdx].orderItems];
              orderItems.splice(newOrderItem.sort, 0, newOrderItem);

              return {
                item: {
                  ...items[itemIdx],
                  orderItems,
                },
                index: itemIdx,
              };
            },
          },
        });
      });
}

// $FlowFixMe not compatible with hook implementation
function onCreateBatchFactory(client: ApolloClient, dispatch: Action => void) {
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
            callback: (items: Array<Object>) => {
              const orderItemId = newBatch.orderItem?.id;
              const orderId = newBatch.orderItem?.order?.id;
              if (!orderItemId || !orderId) {
                return null;
              }

              const itemIdx = items.findIndex(item => item.id === orderId);
              if (itemIdx === -1) {
                return null;
              }

              const orderItemIdx = items[itemIdx].orderItems.findIndex(
                orderItem => orderItem.id === orderItemId
              );
              if (orderItemIdx === -1) {
                return null;
              }

              const orderItems = [...items[itemIdx].orderItems];
              const batches = [...orderItems[orderItemIdx].batches];
              batches.splice(newBatch.sort, 0, newBatch);
              orderItems[orderItemIdx] = {
                ...orderItems[orderItemIdx],
                batches,
              };

              return {
                item: {
                  ...items[itemIdx],
                  orderItems,
                },
                index: itemIdx,
              };
            },
          },
        });
      });
}

// $FlowFixMe not compatible with hook implementation
function onBatchQuantityRevisionFactory(client: ApolloClient, dispatch: Action => void) {
  return (batchQuantityRevisionId: string, items: Array<Object>) =>
    client
      .query({
        query: batchQuantityRevisionByIDQuery,
        fetchPolicy: 'network-only',
        variables: {
          id: batchQuantityRevisionId,
        },
      })
      .then(({ data }) => {
        const batchQuantityRevision = data?.batchQuantityRevision;
        if (batchQuantityRevision?.__typename !== 'BatchQuantityRevision') {
          return;
        }

        items.every((order, orderIdx) =>
          order.orderItems.every((orderItem, orderItemIdx) =>
            orderItem.batches.every((batch, batchIdx) => {
              if (batch.id !== batchQuantityRevision.batch?.id) {
                return true;
              }

              const orderItems = [...order.orderItems];
              const batches = [...orderItem.batches];

              let found = false;
              const batchQuantityRevisions = batch.batchQuantityRevisions
                .filter(bqr => !!bqr.id)
                .map(bqr => {
                  if (bqr.id === batchQuantityRevision.id) {
                    found = true;
                    return batchQuantityRevision;
                  }

                  return bqr;
                });

              if (!found) {
                batchQuantityRevisions.splice(batchQuantityRevision.sort, 0, batchQuantityRevision);
              }

              batches[batchIdx] = {
                ...batch,
                batchQuantityRevisions,
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
      });
}

// $FlowFixMe not compatible with hook implementation
function onUpdateBatchContainerFactory(client: ApolloClient, dispatch: Action => void) {
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
          if (container?.__typename !== 'Container') {
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
function onUpdateBatchShipmentFactory(client: ApolloClient, dispatch: Action => void) {
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
          if (shipment?.__typename !== 'Shipment') {
            return;
          }

          changeShipment(batchId, shipment, items);
        });
    } else {
      changeShipment(batchId, null, items);
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
        callback: (items: Array<Object>) => {
          const itemIdx = items.findIndex(
            item => !!item.orderItems.find(orderItem => orderItem.id === orderItemId)
          );
          if (itemIdx === -1) {
            return null;
          }

          return {
            item: {
              ...items[itemIdx],
              orderItems: items[itemIdx].orderItems.filter(
                orderItem => orderItem.id !== orderItemId
              ),
            },
            index: itemIdx,
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
        callback: (items: Array<Object>) => {
          const itemIdx = items.findIndex(
            item =>
              !!item.orderItems.find(
                orderItem => !!orderItem.batches.find(batch => batch.id === batchId)
              )
          );
          if (itemIdx === -1) {
            return null;
          }

          return {
            item: {
              ...items[itemIdx],
              orderItems: items[itemIdx].orderItems.map(orderItem => ({
                ...orderItem,
                batches: orderItem.batches.filter(batch => batch.id !== batchId),
              })),
            },
            index: itemIdx,
          };
        },
      },
    });
  };
}

function onDeleteBatchQuantityRevisionFactory(dispatch: Action => void) {
  return (batchQuantityRevisionId: string, items: Array<Object>) =>
    items.every((order, orderIdx) =>
      order.orderItems.every((orderItem, orderItemIdx) =>
        orderItem.batches.every((batch, batchIdx) =>
          batch.batchQuantityRevisions.every(batchQuantityRevision => {
            if (batchQuantityRevision.id !== batchQuantityRevisionId) {
              return true;
            }

            const orderItems = [...order.orderItems];
            const batches = [...orderItem.batches];
            batches[batchIdx] = {
              ...batch,
              batchQuantityRevisions: batch.batchQuantityRevisions.filter(
                bqr => bqr.id !== batchQuantityRevisionId
              ),
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
      )
    );
}

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const onCreateOrderItem = onCreateOrderItemFactory(client, dispatch);
  const onCreateBatch = onCreateBatchFactory(client, dispatch);
  const onBatchQuantityRevision = onBatchQuantityRevisionFactory(client, dispatch);
  const onUpdateBatchContainer = onUpdateBatchContainerFactory(client, dispatch);
  const onUpdateBatchShipment = onUpdateBatchShipmentFactory(client, dispatch);
  const onDeleteOrderItem = onDeleteOrderItemFactory(dispatch);
  const onDeleteBatch = onDeleteBatchFactory(dispatch);
  const onDeleteBatchQuantityRevision = onDeleteBatchQuantityRevisionFactory(dispatch);

  return async (event: EntityEvent, items: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'OrderItem': {
            await onCreateOrderItem(event.entity.id);
            break;
          }
          case 'Batch': {
            await onCreateBatch(event.entity.id);
            break;
          }
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, items);
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
                onDeleteOrderItem(event.entity.id);
                await onCreateOrderItem(event.entity.id);

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
                  onDeleteBatch(event.entity.id);
                  await onCreateBatch(event.entity.id);
                  return false;
                case 'container':
                  await onUpdateBatchContainer(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    items
                  );
                  return false;
                case 'shipment':
                  await onUpdateBatchShipment(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    items
                  );
                  return false;
                default:
                  return true;
              }
            });
            break;
          }
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, items);
            return;
          }
          case 'Shipment': {
            changes = changes.map(change => {
              switch (change.field) {
                case 'transportType':
                  return {
                    ...change,
                    new: {
                      string: change.new.int === 1 ? 'Air' : 'Sea',
                      __typename: 'StringValue',
                    },
                  };
                default:
                  return change;
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
          case 'BatchQuantityRevision':
            onDeleteBatchQuantityRevision(event.entity.id, items);
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
