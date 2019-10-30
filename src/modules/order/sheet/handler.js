// @flow
import ApolloClient from 'apollo-client';
import { filterAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
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
                order: {
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
                order: {
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

// $FlowFixMe not compatible with hook implementation
function onBatchQuantityRevisionFactory(client: ApolloClient, dispatch: Action => void) {
  return (batchQuantityRevisionId: string, orders: Array<Object>) =>
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

        orders.every((order, orderIdx) =>
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
                  order: {
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
              order: {
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

// $FlowFixMe not compatible with hook implementation
function onUpdateBatchShipmentFactory(client: ApolloClient, dispatch: Action => void) {
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
              order: {
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
            order: {
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
            order: {
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

function onDeleteBatchQuantityRevisionFactory(dispatch: Action => void) {
  return (batchQuantityRevisionId: string, orders: Array<Object>) =>
    orders.every((order, orderIdx) =>
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
                order: {
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

  return async (event: EntityEvent, orders: Array<Object>) => {
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
            await onBatchQuantityRevision(event.entity.id, orders);
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
              .map(order => order.orderItems.map(oi => oi.batches).flat())
              // $FlowFixMe flat not supported by flow
              .flat()
              .find(b => b.id === event.entity.id);
            if (batch) {
              changes = changes.reduce((newChanges, change) => {
                switch (change.field) {
                  case 'packageQuantity':
                  case 'autoCalculatePackageQuantity': {
                    const hasChange = !!newChanges.find(
                      c =>
                        c.field === 'packageQuantity' || c.field === 'autoCalculatePackageQuantity'
                    );
                    if (hasChange) {
                      return newChanges.map(c => {
                        if (
                          c.field === 'packageQuantity' ||
                          c.field === 'autoCalculatePackageQuantity'
                        ) {
                          return {
                            ...change,
                            field: 'packageQuantity',
                            new: {
                              custom: {
                                ...(() => {
                                  switch (change.field) {
                                    case 'packageQuantity':
                                      return {
                                        ...(c?.new?.custom ?? {}),
                                        value: change.new?.float,
                                      };
                                    case 'autoCalculatePackageQuantity':
                                      return {
                                        ...(c?.new?.custom ?? {}),
                                        auto: change.new?.boolean,
                                      };
                                    default:
                                      return batch.packageQuantity;
                                  }
                                })(),
                              },
                              __typename: 'CustomValue',
                            },
                          };
                        }
                        return c;
                      });
                    }

                    return [
                      ...newChanges,
                      {
                        ...change,
                        field: 'packageQuantity',
                        new: {
                          custom: {
                            ...(() => {
                              switch (change.field) {
                                case 'packageQuantity':
                                  return {
                                    ...batch.packageQuantity,
                                    value: change.new?.float,
                                  };
                                case 'autoCalculatePackageQuantity':
                                  return {
                                    ...batch.packageQuantity,
                                    auto: change.new?.boolean,
                                  };
                                default:
                                  return batch.packageQuantity;
                              }
                            })(),
                          },
                          __typename: 'CustomValue',
                        },
                      },
                    ];
                  }
                  default:
                    return [...newChanges, change];
                }
              }, []);
            }

            break;
          }
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, orders);
            return;
          }
          case 'Shipment': {
            changes = changes.map(change => {
              switch (change.field) {
                case 'transportType':
                  return {
                    ...change,
                    new: {
                      string: change.new?.int === 1 ? 'Air' : 'Sea',
                      __typename: 'StringValue',
                    },
                  };
                default:
                  return change;
              }
            });
            break;
          }
          case 'Container': {
            console.warn({ changes });
            changes = changes.map(change => {
              switch (change.field) {
                case 'transportType':
                  return {
                    ...change,
                    new: {
                      string: change.new?.int === 1 ? 'Air' : 'Sea',
                      __typename: 'StringValue',
                    },
                  };
                default:
                  return change;
              }
            });
            break;
          }
          case 'Voyage':
            changes = changes.map(change => {
              switch (change.field) {
                case 'departurePort':
                case 'arrivalPort': {
                  return {
                    ...change,
                    new: {
                      custom: {
                        seaport: change.new?.string,
                        airport: change.new?.string,
                      },
                      __typename: 'CustomValue',
                    },
                  };
                }
                default:
                  return change;
              }
            });
            break;
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
            onDeleteBatchQuantityRevision(event.entity.id, orders);
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
