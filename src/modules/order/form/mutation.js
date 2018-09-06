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

export const prepareCreateOrderInput = ({
  orderItems = [],
  exporter = {},
  tags = [],
  issuedAt = '',
  ...data
}: Object): OrderForm => ({
  ...data,
  exporterId: exporter.id,
  issuedAt: issuedAt ? new Date(issuedAt) : null,
  tagIds: tags.map(({ id }) => id),
  orderItems: orderItems.map(({ batches, productExporterSupplier, ...orderItem }) => ({
    ...orderItem,
    productProviderId: productExporterSupplier.id,
    batches: batches.map(({ assignments, tags: tagsArr = [], ...batch }) => ({
      ...batch,
      tagIds: tagsArr ? tagsArr.map(t => t.id) : null,
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

export const prepareUpdateOrderInput = ({
  id,
  createdAt,
  updatedAt,
  issuedAt = '',
  orderItems = [],
  tags = [],
  exporter = {},
  ...data
}: Object): OrderForm => ({
  ...data,
  exporterId: exporter.id,
  issuedAt: issuedAt ? new Date(issuedAt) : null,
  tagIds: tags.map(({ id: tagId }) => tagId),
  orderItems: orderItems.map(({ batches, productExporterSupplier, ...orderItem }) => ({
    ...orderItem,
    productProviderId: productExporterSupplier.id,
    batches: batches.map(({ assignments, tags: tagsArr = [], ...batch }) => ({
      ...batch,
      tagIds: tagsArr ? tagsArr.map(t => t.id) : null,
    })),
  })),
});
