// @flow
import ApolloClient from 'apollo-client';
import { removeTypename } from 'utils/data';
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

function normalizedInput(entity: Object, field: string, value: any, item: Object): Object {
  switch (entity.type) {
    case 'Shipment':
      switch (field) {
        case 'blDate':
        case 'bookingDate':
          return {
            [field]: new Date(value),
          };
        case 'files':
          return {
            files: value.map(
              ({ __typename, entity: e, path, uploading, progress, ...rest }) => rest
            ),
          };
        default:
          return {
            [field]: value,
          };
      }
    case 'TimelineDate': {
      const shipment = item;
      if (!shipment) {
        return {};
      }

      const input = (() => {
        switch (field) {
          case 'date':
            return {
              date: new Date(value),
            };
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
            },
          ],
        };
      }

      if (entity.id === shipment.containerGroups[0].warehouseArrival.id) {
        return {
          containerGroups: [
            {
              warehouseArrival: input,
            },
          ],
        };
      }

      if (entity.id === shipment.containerGroups[0].deliveryReady.id) {
        return {
          containerGroups: [
            {
              deliveryReady: input,
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
