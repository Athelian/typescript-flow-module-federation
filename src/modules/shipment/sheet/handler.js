// @flow
import ApolloClient from 'apollo-client';
import { filterAsync, mapAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import type {
  EntityEvent,
  EntityEventChange,
  EntityEventHandler,
} from 'components/Sheet/SheetLive/types';
import { mergeChanges, newCustomValue } from 'components/Sheet/SheetLive/helper';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import { batchQuantityRevisionByIDQuery } from 'modules/sheet/batch/query';
import {
  organizationByIDQuery,
  organizationsByIDsQuery,
  tagsByIDsQuery,
  userByIDQuery,
  usersByIDsQuery,
  warehouseByIDQuery,
} from 'modules/sheet/common/query';
import { batchByIDQuery, containerByIDQuery, orderByIDQuery, orderItemByIDQuery } from './query';

// $FlowFixMe not compatible with hook implementation
function onCreateContainerFactory(client: ApolloClient, dispatch: Action => void) {
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
              containers.splice(newContainer.sort, 0, newContainer);

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

                batches.splice(newBatch.containerSort, 0, newBatch);

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

              batches.splice(newBatch.shipmentSort, 0, newBatch);

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

        items.every((shipment, shipmentIdx) => {
          const done = !shipment.batchesWithoutContainer.every((batch, batchIdx) => {
            if (batch.id !== batchQuantityRevision.batch?.id) {
              return true;
            }

            const batches = [...shipment.batchesWithoutContainer];

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

            dispatch({
              type: Actions.REPLACE_ITEM,
              payload: {
                item: {
                  ...shipment,
                  batchesWithoutContainer: batches,
                },
                index: shipmentIdx,
              },
            });

            return false;
          });
          if (done) {
            return false;
          }

          return shipment.containers.every((container, containerIdx) =>
            container.batches.every((batch, batchIdx) => {
              if (batch.id !== batchQuantityRevision.batch?.id) {
                return true;
              }

              const containers = [...shipment.containers];
              const batches = [...container.batches];

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
              containers[containerIdx] = {
                ...container,
                batches,
              };

              dispatch({
                type: Actions.REPLACE_ITEM,
                payload: {
                  item: {
                    ...shipment,
                    containers,
                  },
                  index: shipmentIdx,
                },
              });

              return false;
            })
          );
        });
      });
}

// $FlowFixMe not compatible with hook implementation
function onUpdateBatchOrderItemFactory(client: ApolloClient, dispatch: Action => void) {
  return async (batchId: string, orderItemId: string | null, shipments: Array<Object>) => {
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

        shipments.every((shipment, shipmentIdx) => {
          const result = shipment.batchesWithoutContainer.every((batch, batchIdx) => {
            if (batch.id !== batchId) {
              return true;
            }

            const batches = [...shipment.batchesWithoutContainer];
            batches[batchIdx] = {
              ...batch,
              orderItem,
            };

            dispatch({
              type: Actions.REPLACE_ITEM,
              payload: {
                item: {
                  ...shipment,
                  batchesWithoutContainer: batches,
                },
                index: shipmentIdx,
              },
            });

            return false;
          });
          if (!result) {
            return false;
          }

          return shipment.containers.every((container, containerIdx) =>
            container.batches.every((batch, batchIdx) => {
              if (batch.id !== batchId) {
                return true;
              }

              const containers = [...shipment.containers];
              const batches = [...container.batches];
              batches[batchIdx] = {
                ...batch,
                orderItem,
              };
              containers[containerIdx] = {
                ...container,
                batches,
              };

              dispatch({
                type: Actions.REPLACE_ITEM,
                payload: {
                  item: {
                    ...shipment,
                    containers,
                  },
                  index: shipmentIdx,
                },
              });

              return false;
            })
          );
        });
      });
  };
}

// $FlowFixMe not compatible with hook implementation
function onUpdateBatchOrderItemOrderFactory(client: ApolloClient, dispatch: Action => void) {
  return async (batchId: string, orderId: string | null, shipments: Array<Object>) => {
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

        shipments.every((shipment, shipmentIdx) => {
          const result = shipment.batchesWithoutContainer.every((batch, batchIdx) => {
            if (batch.id !== batchId) {
              return true;
            }

            const batches = [...shipment.batchesWithoutContainer];
            batches[batchIdx] = {
              ...batch,
              orderItem: {
                ...batch.orderItem,
                order,
              },
            };

            dispatch({
              type: Actions.REPLACE_ITEM,
              payload: {
                item: {
                  ...shipment,
                  batchesWithoutContainer: batches,
                },
                index: shipmentIdx,
              },
            });

            return false;
          });
          if (!result) {
            return false;
          }

          return shipment.containers.every((container, containerIdx) =>
            container.batches.every((batch, batchIdx) => {
              if (batch.id !== batchId) {
                return true;
              }

              const containers = [...shipment.containers];
              const batches = [...container.batches];
              batches[batchIdx] = {
                ...batch,
                orderItem: {
                  ...batch.orderItem,
                  order,
                },
              };
              containers[containerIdx] = {
                ...container,
                batches,
              };

              dispatch({
                type: Actions.REPLACE_ITEM,
                payload: {
                  item: {
                    ...shipment,
                    containers,
                  },
                  index: shipmentIdx,
                },
              });

              return false;
            })
          );
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
  return (batchId: string) => {
    dispatch({
      type: Actions.PRE_REMOVE_ENTITY,
      payload: {
        entity: {
          id: batchId,
          type: 'Batch',
        },
        callback: (shipments: Array<Object>) => {
          const shipmentIdx = shipments.findIndex(
            shipment =>
              !!shipment.containers.find(
                container => !!container.batches.find(batch => batch.id === batchId)
              ) || !!shipment.batchesWithoutContainer.find(batch => batch.id === batchId)
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

function onDeleteBatchQuantityRevisionFactory(dispatch: Action => void) {
  return (batchQuantityRevisionId: string, items: Array<Object>) =>
    items.every((shipment, shipmentIdx) => {
      const done = !shipment.batchesWithoutContainer.every((batch, batchIdx) => {
        if (batch.id !== batchQuantityRevisionId) {
          return true;
        }

        const batches = [...shipment.batchesWithoutContainer];
        batches[batchIdx] = {
          ...batch,
          batchQuantityRevisions: batch.batchQuantityRevisions.filter(
            bqr => bqr.id !== batchQuantityRevisionId
          ),
        };

        dispatch({
          type: Actions.REPLACE_ITEM,
          payload: {
            item: {
              ...shipment,
              batchesWithoutContainer: batches,
            },
            index: shipmentIdx,
          },
        });

        return false;
      });
      if (done) {
        return false;
      }

      return shipment.containers.every((container, containerIdx) =>
        container.batches.every((batch, batchIdx) => {
          if (batch.id !== batchQuantityRevisionId) {
            return true;
          }

          const containers = [...shipment.containers];
          const batches = [...container.batches];
          batches[batchIdx] = {
            ...batch,
            batchQuantityRevisions: batch.batchQuantityRevisions.filter(
              bqr => bqr.id !== batchQuantityRevisionId
            ),
          };
          containers[containerIdx] = {
            ...container,
            batches,
          };

          dispatch({
            type: Actions.REPLACE_ITEM,
            payload: {
              item: {
                ...shipment,
                containers,
              },
              index: shipmentIdx,
            },
          });

          return false;
        })
      );
    });
}

export default function entityEventHandler(
  // $FlowFixMe not compatible with hook implementation
  client: ApolloClient,
  dispatch: Action => void
): EntityEventHandler {
  const onCreateContainer = onCreateContainerFactory(client, dispatch);
  const onCreateBatch = onCreateBatchFactory(client, dispatch);
  const onBatchQuantityRevision = onBatchQuantityRevisionFactory(client, dispatch);
  const onUpdateBatchOrderItem = onUpdateBatchOrderItemFactory(client, dispatch);
  const onUpdateBatchOrderItemOrder = onUpdateBatchOrderItemOrderFactory(client, dispatch);
  const onDeleteContainer = onDeleteContainerFactory(dispatch);
  const onDeleteBatch = onDeleteBatchFactory(dispatch);
  const onDeleteBatchQuantityRevision = onDeleteBatchQuantityRevisionFactory(dispatch);

  return async (event: EntityEvent, shipments: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          case 'Container': {
            await onCreateContainer(event.entity.id);
            break;
          }
          case 'Batch':
            onCreateBatch(event.entity.id);
            break;
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, shipments);
            break;
          }
          default:
            break;
        }
        break;
      case 'Update': {
        let { changes } = event;

        switch (event.entity.__typename) {
          case 'Shipment': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'importer':
                case 'exporter':
                  if (change.new) {
                    return client
                      .query({
                        query: organizationByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: change.field,
                        new: newCustomValue(data.organization),
                      }));
                  }
                  break;
                case 'forwarders':
                  return client
                    .query({
                      query: organizationsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.organizationsByIDs),
                    }));
                case 'transportType':
                  return {
                    ...change,
                    new: {
                      string: change.new?.int === 1 ? 'Air' : 'Sea',
                      __typename: 'StringValue',
                    },
                  };
                case 'inCharges':
                  return client
                    .query({
                      query: usersByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.usersByIDs),
                    }));
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });
            break;
          }
          case 'TimelineDate': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'approvedBy':
                  if (change.new) {
                    return client
                      .query({
                        query: userByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: 'approvedBy',
                        new: newCustomValue(data.user),
                      }));
                  }
                  break;
                case 'assignedTo':
                  return client
                    .query({
                      query: usersByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.usersByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });

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

            if (shipment) {
              const timelineDate = (() => {
                if (shipment.cargoReady?.id === event.entity?.id) {
                  return shipment.cargoReady;
                }
                if (shipment.containerGroups[0].customClearance.id === event.entity?.id) {
                  return shipment.containerGroups[0].customClearance;
                }
                if (shipment.containerGroups[0].warehouseArrival.id === event.entity?.id) {
                  return shipment.containerGroups[0].warehouseArrival;
                }
                if (shipment.containerGroups[0].deliveryReady.id === event.entity?.id) {
                  return shipment.containerGroups[0].deliveryReady;
                }

                const voyage = shipment.voyages.find(
                  v => v.departure.id === event.entity?.id || v.arrival.id === event.entity?.id
                );

                if (voyage.departure.id === event.entity?.id) {
                  return voyage.departure;
                }

                return voyage.arrival;
              })();

              changes = mergeChanges(
                changes,
                {
                  approvedBy: (i, v) => ({
                    ...i,
                    user: v,
                  }),
                  approvedAt: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                },
                'approved',
                timelineDate.approved
              );
            }

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
          case 'ContainerGroup':
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'warehouse':
                  if (change.new) {
                    return client
                      .query({
                        query: warehouseByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: 'warehouse',
                        new: newCustomValue(data.warehouse),
                      }));
                  }
                  break;
                default:
                  break;
              }

              return change;
            });
            break;
          case 'Container': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'containerOption':
                  return {
                    ...change,
                    new: {
                      string: change.new?.int === 1 ? 'Hanger' : '',
                      __typename: 'StringValue',
                    },
                  };
                case 'warehouseArrivalAgreedDateApprovedBy':
                case 'warehouseArrivalActualDateApprovedBy':
                case 'departureDateApprovedBy':
                  if (change.new) {
                    return client
                      .query({
                        query: userByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: change.field,
                        new: newCustomValue(data.user),
                      }));
                  }
                  break;
                case 'warehouseArrivalAgreedDateAssignedTo':
                case 'warehouseArrivalActualDateAssignedTo':
                case 'departureDateAssignedTo':
                  return client
                    .query({
                      query: usersByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.usersByIDs),
                    }));
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });

            const container = shipments
              .map(shipment => shipment.containers)
              // $FlowFixMe flat not supported by flow
              .flat()
              .find(c => c.id === event.entity?.id);

            if (container) {
              changes = mergeChanges(
                changes,
                {
                  freeTimeStartDate: (i, v) => ({
                    ...i,
                    value: v,
                  }),
                  autoCalculatedFreeTimeStartDate: (i, v) => ({
                    ...i,
                    auto: v,
                  }),
                },
                'freeTimeStartDate',
                container.freeTimeStartDate
              );
              changes = mergeChanges(
                changes,
                {
                  warehouseArrivalAgreedDateApprovedBy: (i, v) => ({
                    ...i,
                    user: v,
                  }),
                  warehouseArrivalAgreedDateApprovedAt: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                },
                'warehouseArrivalAgreedDateApproved',
                container.warehouseArrivalAgreedDateApproved
              );
              changes = mergeChanges(
                changes,
                {
                  warehouseArrivalActualDateApprovedBy: (i, v) => ({
                    ...i,
                    user: v,
                  }),
                  warehouseArrivalActualDateApprovedAt: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                },
                'warehouseArrivalActualDateApproved',
                container.warehouseArrivalActualDateApproved
              );
              changes = mergeChanges(
                changes,
                {
                  departureDateApprovedBy: (i, v) => ({
                    ...i,
                    user: v,
                  }),
                  departureDateApprovedAt: (i, v) => ({
                    ...i,
                    date: v,
                  }),
                },
                'departureDateApproved',
                container.departureDateApproved
              );
            }

            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'warehouse':
                  if (change.new) {
                    return client
                      .query({
                        query: warehouseByIDQuery,
                        variables: { id: change.new?.entity?.id },
                      })
                      .then(({ data }) => ({
                        field: 'warehouse',
                        new: newCustomValue(data.warehouse),
                      }));
                  }
                  break;
                default:
                  break;
              }

              return change;
            });
            break;
          }
          case 'Batch': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'orderItem':
                  await onUpdateBatchOrderItem(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    shipments
                  );
                  return false;
                case 'container':
                case 'shipment':
                  onDeleteBatch(event.entity.id);
                  await onCreateBatch(event.entity.id);
                  return false;
                default:
                  return true;
              }
            });

            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });

            const batch = shipments
              .map(shipment => [
                ...shipment.batchesWithoutContainer,
                ...shipment.containers.map(c => c.batches).flat(),
              ])
              // $FlowFixMe flat not supported by flow
              .flat()
              .find(b => b.id === event.entity.id);
            if (batch) {
              changes = mergeChanges(
                changes,
                {
                  packageQuantity: (i, v) => ({
                    ...i,
                    value: v,
                  }),
                  autoCalculatePackageQuantity: (i, v) => ({
                    ...i,
                    auto: v,
                  }),
                },
                'packageQuantity',
                batch.packageQuantity
              );
              changes = mergeChanges(
                changes,
                {
                  packageVolume: (i, v) => ({
                    ...i,
                    value: v,
                  }),
                  autoCalculatePackageVolume: (i, v) => ({
                    ...i,
                    auto: v,
                  }),
                },
                'packageVolume',
                batch.packageVolume
              );
            }
            break;
          }
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, shipments);
            return;
          }
          case 'OrderItem': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'order':
                  await onUpdateBatchOrderItemOrder(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    shipments
                  );
                  return false;
                default:
                  return true;
              }
            });

            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                default:
                  break;
              }

              return change;
            });
            break;
          }
          case 'Order':
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'importer':
                case 'exporter':
                  return client
                    .query({
                      query: organizationByIDQuery,
                      variables: { id: change.new?.entity?.id },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.organization),
                    }));
                case 'inCharges':
                  return client
                    .query({
                      query: usersByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.usersByIDs),
                    }));
                case 'tags':
                  return client
                    .query({
                      query: tagsByIDsQuery,
                      variables: { ids: (change.new?.values ?? []).map(v => v.entity?.id) },
                    })
                    .then(({ data }) => ({
                      field: change.field,
                      new: newCustomValue(data.tagsByIDs),
                    }));
                default:
                  break;
              }

              return change;
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
          case 'Container':
            onDeleteContainer(event.entity.id);
            break;
          case 'Batch':
            onDeleteBatch(event.entity.id);
            break;
          case 'BatchQuantityRevision':
            onDeleteBatchQuantityRevision(event.entity.id, shipments);
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
