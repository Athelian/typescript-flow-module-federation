// @flow
import ApolloClient from 'apollo-client';
import {
  batchMutation,
  containerMutation,
  orderItemMutation,
  orderMutation,
  shipmentMutation,
} from './query';

const mutations = {
  Order: orderMutation,
  OrderItem: orderItemMutation,
  Batch: batchMutation,
  Container: containerMutation,
  Shipment: shipmentMutation,
};

function normalizedInput(type: string, field: string, value: any): Object {
  switch (type) {
    case 'Order':
      switch (field) {
        case 'deliveryDate':
        case 'issuedAt':
          return {
            [field]: new Date(value),
          };
        case 'files':
          return {
            files: value.map(({ __typename, entity, path, uploading, progress, ...rest }) => rest),
          };
        default:
          return {
            [field]: value,
          };
      }
    case 'OrderItem':
      switch (field) {
        case 'price': {
          if (value.value === null) {
            return { price: null };
          }
          return {
            price: {
              amount: value.value,
              currency: value.metric,
            },
          };
        }
        case 'deliveryDate':
          return {
            [field]: new Date(value),
          };
        default:
          return {
            [field]: value,
          };
      }
    case 'Batch':
      switch (field) {
        case 'desiredAt':
        case 'expiredAt':
        case 'deliveredAt':
        case 'producedAt':
          return {
            [field]: new Date(value),
          };
        default:
          return {
            [field]: value,
          };
      }
    case 'Shipment':
      switch (field) {
        case 'blDate':
        case 'bookingDate':
          return {
            [field]: new Date(value),
          };

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
  }: {
    entity: Object,
    field: string,
    value: any,
  }): Promise<Array<Object> | null> {
    return client
      .mutate({
        mutation: mutations[entity.type],
        variables: {
          id: entity.id,
          input: normalizedInput(entity.type, field, value),
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
