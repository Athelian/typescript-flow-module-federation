// @flow
import ApolloClient from 'apollo-client';
import type { Action } from 'components/Sheet/SheetState';
import { Actions } from 'components/Sheet/SheetState/contants';
import type { EntityEvent, EntityEventHandler } from 'components/Sheet/SheetLive/entity';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import { batchByIDSheetQuery, orderItemByIDSheetQuery } from './query';

// $FlowFixMe not compatible with hook implementation
function addOrderItemFactory(client: ApolloClient, dispatch: Action => void) {
  return async (orderItemId: string, items: Array<Object>) => {
    await client
      .query({
        query: orderItemByIDSheetQuery,
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
        query: batchByIDSheetQuery,
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

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const addOrderItem = addOrderItemFactory(client, dispatch);
  const addBatch = addBatchFactory(client, dispatch);

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
            changes = changes.filter(async change => {
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
            changes = changes.filter(async change => {
              switch (change.field) {
                case 'orderItem':
                  // todo: remove batch from order item
                  await addBatch(event.entity.id, items);
                  return false;
                case 'container':
                  // todo: fetch new container info and replace
                  return false;
                case 'shipment':
                  // todo: fetch new shipment info and replace
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
