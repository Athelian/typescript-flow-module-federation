// @flow
import { ApolloClient } from 'apollo-client';
import type { Batch } from 'generated/graphql';
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
import { handleProductChanges } from 'modules/sheet/product/handler';
import { handleProductProviderChanges } from 'modules/sheet/productProvider/handler';
import { handleOrderItemChanges } from 'modules/sheet/orderItem/handler';
import { handleBatchChanges } from 'modules/sheet/batch/handler';
import {
  handleContainerGroupChanges,
  handleShipmentChanges,
  handleTimelineDateChanges,
  handleVoyageChanges,
} from 'modules/sheet/shipment/handler';
import { handleContainerChanges } from 'modules/sheet/container/handler';
import { decorateContainer, decorateShipment } from './decorator';
import { orderByIDQuery, containerByIDQuery, orderItemByIDQuery, shipmentByIDQuery } from './query';

function replaceBatch({
  batchId,
  field,
  data,
  dispatch,
}: {
  batchId: string,
  field: string,
  data: mixed,
  dispatch: Action => void,
}) {
  dispatch({
    type: Actions.REPLACE_ITEM,
    payload: {
      callback: (batches: Array<Object>) => {
        const batchIdx = batches.findIndex(({ id }) => batchId === id);
        if (batchIdx < 0) {
          return null;
        }

        return {
          item: {
            ...batches[batchIdx],
            [field]: data,
          },
          index: batchIdx,
        };
      },
    },
  });
}

function onUpdateBatchContainerFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return async (batchId: string, containerId: string | null) => {
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
          if (data?.container?.__typename !== 'Container') {
            return;
          }

          replaceBatch({
            batchId,
            dispatch,
            field: 'container',
            data: decorateContainer(data?.container),
          });
        });
    } else {
      replaceBatch({
        batchId,
        dispatch,
        field: 'container',
        data: null,
      });
    }
  };
}

function onUpdateBatchShipmentFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return async (batchId: string, shipmentId: string | null) => {
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
          if (data?.shipment?.__typename !== 'Shipment') {
            return;
          }

          replaceBatch({
            batchId,
            dispatch,
            field: 'shipment',
            data: decorateShipment(data?.shipment),
          });
        });
    } else {
      replaceBatch({
        batchId,
        dispatch,
        field: 'shipment',
        data: null,
      });
    }
  };
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
        if (data?.orderItem?.__typename !== 'OrderItem') {
          return;
        }

        replaceBatch({
          batchId,
          dispatch,
          field: 'orderItem',
          data: data?.orderItem,
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
          type: Actions.REPLACE_ITEMS,
          payload: {
            callback: (batches: Array<Object>) => {
              const itemIds = (order?.orderItems ?? []).map(item => item?.id).filter(Boolean);
              const replaceItems = [];

              batches.forEach((batch, batchIdx) => {
                if (itemIds.includes(batch?.orderItem?.id)) {
                  replaceItems.push({
                    item: {
                      ...batch,
                      orderItem: {
                        ...batch.orderItem,
                        order,
                      },
                    },
                    index: batchIdx,
                  });
                }
              });

              return replaceItems;
            },
          },
        });
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
        callback: (batches: Array<Batch>) => {
          const batchIdx = batches.findIndex(({ id }) => id === batchId);
          if (batchIdx === -1) {
            return null;
          }

          return {
            item: null,
            index: batchIdx,
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
  // $FlowFixMe Cannot use  `ApolloClient` [1] without 1 type argument.Flow(InferError)
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const onUpdateBatchOrderItem = onUpdateBatchOrderItemFactory(client, dispatch);
  const onUpdateBatchOrderItemOrder = onUpdateBatchOrderItemOrderFactory(client, dispatch);
  const onUpdateBatchContainer = onUpdateBatchContainerFactory(client, dispatch);
  const onUpdateBatchShipment = onUpdateBatchShipmentFactory(client, dispatch);
  const onDeleteBatch = onDeleteBatchFactory(dispatch);

  return async (event: EntityEvent, batches: Array<Batch>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          default:
            break;
        }
        break;
      case 'Update': {
        let { changes } = event;

        switch (event.entity.__typename) {
          default:
            break;
        }

        switch (event.entity.__typename) {
          case 'Order': {
            changes = await handleOrderChanges(client, changes);
            break;
          }
          case 'Product':
            changes = await handleProductChanges(client, changes);
            break;
          case 'ProductProvider':
            changes = await handleProductProviderChanges(client, changes);
            break;
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
          case 'Batch': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'orderItem':
                  await onUpdateBatchOrderItem(event.entity.id, change.new?.entity?.id ?? null);
                  return false;
                case 'container':
                  await onUpdateBatchContainer(event.entity.id, change.new?.entity?.id ?? null);
                  return false;
                case 'shipment':
                  await onUpdateBatchShipment(event.entity.id, change.new?.entity?.id ?? null);
                  return false;
                default:
                  return true;
              }
            });

            const batch = batches.find(({ id }) => id === event.entity.id);
            changes = await handleBatchChanges(client, changes, batch);
            break;
          }
          case 'Shipment': {
            const shipment = batches
              .map(b => b.shipment)
              .filter(Boolean)
              .find(s => isBelongToShipment(s, event.entity?.id));
            changes = await handleShipmentChanges(client, changes, shipment);
            break;
          }
          case 'TimelineDate': {
            const shipment = batches
              .map(b => b.shipment)
              .filter(Boolean)
              .find(s => isBelongToShipment(s, event.entity?.id));
            changes = await handleTimelineDateChanges(client, changes, event.entity.id, shipment);
            break;
          }
          case 'Container': {
            const container = batches
              .map(b => b.container)
              .filter(Boolean)
              .find(c => c.id === event.entity?.id);
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
