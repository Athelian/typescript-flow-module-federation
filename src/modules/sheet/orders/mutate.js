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
