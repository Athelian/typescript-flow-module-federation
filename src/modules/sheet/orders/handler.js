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
  return async (orderItemId: string, items: Array<Object>) => {
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

        const orderId = newOrderItem.order?.id;
        if (!orderId) {
          return;
        }

        const itemIdx = items.findIndex(item => item.id === orderId);
        if (itemIdx === -1) {
          return;
        }

        const orderItems = [...items[itemIdx].orderItems];
        orderItems.splice(newOrderItem.sort, 0, newOrderItem);

        dispatch({
          type: Actions.REPLACE_ITEM,
          payload: {
            item: {
              ...items[itemIdx],
              orderItems,
            },
            index: itemIdx,
          },
        });

        dispatch({
          type: Actions.ADDED_ROWS_OF_ENTITY,
          payload: {
            id: orderItemId,
            type: 'OrderItem',
          },
        });
      });
  };
}

// $FlowFixMe not compatible with hook implementation
function addBatchFactory(client: ApolloClient, dispatch: Action => void) {
  return async (batchId: string, items: Array<Object>) => {
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

        dispatch({
          type: Actions.REPLACE_ITEM,
          payload: {
            item: {
              ...items[itemIdx],
              orderItems,
            },
            index: itemIdx,
          },
        });

        dispatch({
          type: Actions.ADDED_ROWS_OF_ENTITY,
          payload: {
            id: batchId,
            type: 'Batch',
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

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const addOrderItem = addOrderItemFactory(client, dispatch);
  const addBatch = addBatchFactory(client, dispatch);
  const changeBatchContainer = changeBatchContainerFactory(client, dispatch);
  const changeBatchShipment = changeBatchShipmentFactory(client, dispatch);

  return async (event: EntityEvent, items: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'OrderItem': {
            await addOrderItem(event.entity.id, items);
            break;
          }
          case 'Batch': {
            await addBatch(event.entity.id, items);
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
                // todo: remove item from order
                await addOrderItem(event.entity.id, items);

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
                  // todo: remove batch from order item
                  await addBatch(event.entity.id, items);
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
            // todo: remove order
            break;
          case 'OrderItem':
            // todo: remove item from order
            break;
          case 'Batch':
            // todo: remove batch from order item
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
