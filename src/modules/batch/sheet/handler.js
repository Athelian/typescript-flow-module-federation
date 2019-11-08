// @flow
import { ApolloClient } from 'apollo-client';
import type { Batch } from 'generated/graphql';
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
import {
  organizationByIDQuery,
  organizationsByIDsQuery,
  tagsByIDsQuery,
  userByIDQuery,
  usersByIDsQuery,
  warehouseByIDQuery,
  batchQuantityRevisionByIDQuery,
  containerByIDQuery,
  shipmentByIDQuery,
  orderByIDQuery,
  orderItemByIDQuery,
} from 'modules/gtv/query';

function onBatchQuantityRevisionFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return (batchQuantityRevisionId: string, batches: Array<Batch>) =>
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

        batches.every((batch, batchIdx) => {
          if (batch.id !== batchQuantityRevision.batch?.id) {
            return true;
          }

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

          dispatch({
            type: Actions.REPLACE_ITEM,
            payload: {
              item: {
                ...batch,
                batchQuantityRevisions,
              },
              index: batchIdx,
            },
          });

          return false;
        });
      });
}

function replaceBatch({
  batchId,
  field,
  data,
  batches,
  dispatch,
}: {
  batchId: string,
  field: string,
  data: mixed,
  batches: Array<Batch>,
  dispatch: Function,
}) {
  batches.every((batch, batchIdx) => {
    if (batch.id !== batchId) {
      return true;
    }

    dispatch({
      type: Actions.REPLACE_ITEM,
      payload: {
        item: {
          ...batch,
          [field]: data,
        },
        index: batchIdx,
      },
    });

    return false;
  });
}

function onUpdateBatchContainerFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return async (batchId: string, containerId: string | null, batches: Array<Object>) => {
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
            batches,
            dispatch,
            field: 'container',
            data: data?.container,
          });
        });
    } else {
      replaceBatch({
        batchId,
        batches,
        dispatch,
        field: 'container',
        data: null,
      });
    }
  };
}

function onUpdateBatchShipmentFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return async (batchId: string, shipmentId: string | null, batches: Array<Batch>) => {
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
            batches,
            dispatch,
            field: 'shipment',
            data: data?.shipment,
          });
        });
    } else {
      replaceBatch({
        batchId,
        batches,
        dispatch,
        field: 'container',
        data: null,
      });
    }
  };
}

function onUpdateBatchOrderItemFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return async (batchId: string, orderItemId: string | null, batches: Array<Batch>) => {
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
          batches,
          dispatch,
          field: 'orderItem',
          data: data?.orderItem,
        });
      });
  };
}

function onUpdateBatchOrderItemOrderFactory(client: ApolloClient<any>, dispatch: Action => void) {
  return async (batchId: string, orderId: string | null, batches: Array<Batch>) => {
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

        const itemIds = (order?.orderItem ?? []).map(item => item?.id).filter(Boolean);
        batches.forEach(batch => {
          if (itemIds.includes(batch?.orderItem?.id)) {
            replaceBatch({
              batches,
              dispatch,
              batchId: batch.id,
              field: 'orderItem',
              data: {
                ...batch.orderItem,
                order,
              },
            });
          }
        });
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
  const onBatchQuantityRevision = onBatchQuantityRevisionFactory(client, dispatch);
  const onUpdateBatchContainer = onUpdateBatchContainerFactory(client, dispatch);
  const onUpdateBatchShipment = onUpdateBatchShipmentFactory(client, dispatch);

  return async (event: EntityEvent, batches: Array<Batch>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
          // TODO: batch quantity revision
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
          }
          case 'OrderItem': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'order':
                  await onUpdateBatchOrderItemOrder(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    batches
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
          case 'Batch': {
            changes = await filterAsync(changes, async (change: EntityEventChange) => {
              switch (change.field) {
                case 'orderItem':
                  await onUpdateBatchOrderItem(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    batches
                  );
                  return false;
                case 'container':
                  await onUpdateBatchContainer(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    batches
                  );
                  return false;
                case 'shipment':
                  await onUpdateBatchShipment(
                    event.entity.id,
                    change.new?.entity?.id ?? null,
                    batches
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

            const batch = batches.find(({ id }) => id === event.entity.id);
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
            await onBatchQuantityRevision(event.entity.id, batches);
            return;
          }
          case 'Shipment': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'importer':
                case 'exporter':
                  if (change.new?.entity) {
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

            const batch = batches.find(
              currentBatch =>
                currentBatch?.shipment?.id &&
                isBelongToShipment(currentBatch?.shipment, event.entity?.id)
            );
            if (batch) {
              const shipment = batch?.shipment;
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
          case 'Container': {
            changes = await mapAsync(changes, change => {
              switch (change.field) {
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

            const batch = batches.find(
              currentBatch => currentBatch?.container?.id === event.entity?.id
            );
            if (batch) {
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
                batch.container?.freeTimeStartDate
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
                batch.container?.warehouseArrivalAgreedDateApproved
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
                batch.container?.warehouseArrivalActualDateApproved
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
                batch.container?.departureDateApproved
              );
            }

            changes = await mapAsync(changes, change => {
              switch (change.field) {
                case 'warehouse':
                  if (change.new?.entity) {
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
                  if (change.new?.entity) {
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
          // TODO: remove the whole row when delete a batch
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
}
