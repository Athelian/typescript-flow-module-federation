// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import type { OrderForm } from '../type.js.flow';

export const createOrderMutation = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate(input: $input) {
      order {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const prepareCreateOrderInput = ({ orderItems = [], ...data }: OrderForm) => ({
  ...data,
  orderItems: orderItems.map(({ batches, productExporterSupplier, ...orderItem }) => ({
    ...orderItem,
    productProviderId: productExporterSupplier.id,
    batches: batches.map(({ assignments, tags, ...batch }) => ({
      ...batch,
      tagIds: tags ? tags.map(t => t.id) : null,
    })),
  })),
});

export const updateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      order {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const prepareUpdateOrderInput = ({ orderItems = [], ...data }: OrderForm) => ({
  ...data,
  orderItems: orderItems.map(({ batches, productExporterSupplier, ...orderItem }) => ({
    ...orderItem,
    productProviderId: productExporterSupplier.id,
    batches: batches.map(({ assignments, tags, ...batch }) => ({
      ...batch,
      tagIds: tags ? tags.map(t => t.id) : null,
    })),
  })),
});
