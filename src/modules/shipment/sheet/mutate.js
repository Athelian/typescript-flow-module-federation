// @flow
import ApolloClient from 'apollo-client';
import { parseTodoField, removeTypename } from 'utils/data';
import {
  batchMutation,
  containerMutation,
  orderItemMutation,
  orderMutation,
  shipmentMutation,
} from './query';

const mutations = {
  Shipment: shipmentMutation,
  Container: containerMutation,
  TimelineDate: shipmentMutation,
  Batch: batchMutation,
  OrderItem: orderItemMutation,
  Order: orderMutation,
};

function getEntityId(entity: Object, item: Object): string {
  switch (entity.type) {
    case 'TimelineDate': {
      return item.id;
    }
    default:
      return entity.id;
  }
}

function normalizedInput(entity: Object, field: string, value: any, shipment: Object): Object {
  switch (entity.type) {
    case 'Shipment':
      switch (field) {
        case 'blDate':
        case 'bookingDate':
          return {
            [(field: string)]: new Date(value),
          };
        case 'tags':
          return {
            tagIds: value.map(tag => tag.id),
          };
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, ...rest }) => rest
            ),
          };
        case 'inCharges':
          return {
            inChargeIds: value.map(user => user.id),
          };
        case 'forwarders':
          return {
            forwarderIds: value.map(({ id }) => id),
          };
        case 'todo':
          return parseTodoField(null, value);
        default:
          return {
            [field]: value,
          };
      }
    case 'Voyage': {
      const voyageIdx = shipment.voyages.findIndex(v => v.id === entity.id);

      return {
        voyages: shipment.voyages.map((v, idx) => {
          let input = { id: v.id };

          if (v.id === entity.id) {
            input = {
              ...input,
              [field]: value,
            };
          }

          switch (field) {
            case 'departurePort':
              if (voyageIdx > 0 && idx + 1 === voyageIdx) {
                input = {
                  ...input,
                  arrivalPort: value,
                };
              }
              break;
            case 'arrivalPort':
              if (voyageIdx > 0 && idx - 1 === voyageIdx) {
                input = {
                  ...input,
                  departurePort: value,
                };
              }
              break;
            default:
              break;
          }

          return input;
        }),
      };
    }
    case 'ContainerGroup':
      return {
        containerGroups: shipment.containerGroups.map(cg => {
          if (cg.id !== entity.id) {
            return { id: cg.id };
          }

          switch (field) {
            case 'warehouse':
              return {
                id: cg.id,
                warehouseId: value?.id ?? null,
              };
            default:
              return {
                id: cg.id,
                [field]: value,
              };
          }
        }),
      };
    case 'TimelineDate': {
      const input = (() => {
        switch (field) {
          case 'date':
            return {
              date: new Date(value),
            };
          case 'assignedTo':
            return { assignedToIds: value.map(user => user?.id) };
          case 'approved':
            return { approvedById: value?.user?.id ?? null };
          case 'timelineDateRevisions':
            return {
              timelineDateRevisions: value.map(({ sort, date, ...revision }) => ({
                ...removeTypename(revision),
                date: new Date(date),
              })),
            };
          default:
            return {
              [field]: value,
            };
        }
      })();

      if (entity.id === shipment.cargoReady.id) {
        return {
          cargoReady: input,
        };
      }

      if (entity.id === shipment.containerGroups[0].customClearance.id) {
        return {
          containerGroups: [
            {
              customClearance: input,
              id: shipment.containerGroups[0].id,
            },
          ],
        };
      }

      if (entity.id === shipment.containerGroups[0].warehouseArrival.id) {
        return {
          containerGroups: [
            {
              warehouseArrival: input,
              id: shipment.containerGroups[0].id,
            },
          ],
        };
      }

      if (entity.id === shipment.containerGroups[0].deliveryReady.id) {
        return {
          containerGroups: [
            {
              deliveryReady: input,
              id: shipment.containerGroups[0].id,
            },
          ],
        };
      }

      return {
        voyages: shipment.voyages.map(voyage => {
          if (voyage.departure.id === entity.id) {
            return {
              id: voyage.id,
              departure: input,
            };
          }

          if (voyage.arrival.id === entity.id) {
            return {
              id: voyage.id,
              arrival: input,
            };
          }

          return {
            id: voyage.id,
          };
        }),
      };
    }
    case 'Batch':
      switch (field) {
        case 'desiredAt':
        case 'expiredAt':
        case 'deliveredAt':
        case 'producedAt':
          return {
            /* $FlowFixMe This comment suppresses an error found when upgrading
             * Flow to v0.111.0. To view the error, delete this comment and run
             * Flow. */
            [field]: new Date(value),
          };
        case 'batchQuantityRevisions':
          return {
            batchQuantityRevisions: value.map(({ sort, batch, ...revision }) =>
              removeTypename(revision)
            ),
          };
        case 'tags': {
          return {
            tagIds: value.map(tag => tag.id),
          };
        }
        default:
          return {
            [field]: value,
          };
      }
    default:
      return {
        [field]: value,
      };
  }
}

// $FlowFixMe not compatible with hook implementation
export default function(client: ApolloClient) {
  return function mutate({
    entity,
    field,
    value,
    item,
  }: {
    entity: Object,
    field: string,
    value: any,
    item: Object,
  }): Promise<Array<Object> | null> {
    return client
      .mutate({
        mutation: mutations[entity.type],
        variables: {
          id: getEntityId(entity, item),
          input: normalizedInput(entity, field, value, item),
        },
      })
      .then(({ data }) => {
        const result =
          data?.[`${entity.type.charAt(0).toLowerCase() + entity.type.slice(1)}Update`];

        switch (result?.__typename) {
          case 'Forbidden':
            return [{ message: 'Forbidden' }];
          case 'BadRequest':
            return result?.violations;
          default:
            return null;
        }
      });
  };
}
