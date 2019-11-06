// @flow
import ApolloClient from 'apollo-client';
import { mapAsync } from 'utils/async';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/constants';
import type { EntityEvent, EntityEventHandler } from 'components/Sheet/SheetLive/types';
import { mergeChanges, newCustomValue } from 'components/Sheet/SheetLive/helper';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import {
  batchQuantityRevisionByIDQuery,
  organizationByIDQuery,
  userByIDQuery,
  warehouseByIDQuery,
} from './query';

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
  const onBatchQuantityRevision = onBatchQuantityRevisionFactory(client, dispatch);
  const onDeleteBatchQuantityRevision = onDeleteBatchQuantityRevisionFactory(dispatch);

  return async (event: EntityEvent, shipments: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
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
                case 'transportType':
                  return {
                    ...change,
                    new: {
                      string: change.new?.int === 1 ? 'Air' : 'Sea',
                      __typename: 'StringValue',
                    },
                  };
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
                  return client
                    .query({
                      query: userByIDQuery,
                      variables: { id: change.new?.entity?.id },
                    })
                    .then(({ data }) => ({
                      field: 'approvedBy',
                      new: newCustomValue(data.user),
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
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, shipments);
            return;
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
