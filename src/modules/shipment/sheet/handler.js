// @flow
import ApolloClient from 'apollo-client';
import type { Action } from 'components/Sheet/SheetState/types';
import { Actions } from 'components/Sheet/SheetState/contants';
import type { EntityEvent, EntityEventHandler } from 'components/Sheet/SheetLive/entity';
import { defaultEntityEventChangeTransformer } from 'components/Sheet/SheetLive/entity';
import { batchQuantityRevisionByIDQuery } from './query';

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

  return async (event: EntityEvent, items: Array<Object>) => {
    switch (event.lifeCycle) {
      case 'Create':
        switch (event.entity.__typename) {
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
          case 'BatchQuantityRevision': {
            await onBatchQuantityRevision(event.entity.id, items);
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
