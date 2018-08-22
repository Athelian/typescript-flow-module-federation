// @flow
import gql from 'graphql-tag';
import type { OrderForm } from '../type.js.flow';

export const createOrderMutation = gql`
  mutation createOrder($input: CreateDeepOrderInput!) {
    createDeepOrder(input: $input) {
      id
    }
  }
`;

export const prepareCreateOrderInput = ({ items = [], ...data }: OrderForm) => ({
  ...data,
  items: items.map(({ batchItems, productExporterSupplier, ...item }) => ({
    ...item,
    productExporterSupplierId: productExporterSupplier.id,
    batchItems: batchItems.map(({ assignments, tags, ...batchItem }) => ({
      ...batchItem,
      tags: tags ? tags.map(t => t.id) : null,
      assignments: assignments.map(({ user, request, ...assign }) => ({
        userId: user.id,
        requestId: request ? request.id : null,
        ...assign,
      })),
    })),
  })),
});

export const updateOrderMutation = gql`
  mutation updateOrder($id: ID!, $input: UpdateDeepOrderInput!) {
    updateDeepOrder(id: $id, input: $input) {
      id
    }
  }
`;

export const prepareUpdateOrderInput = ({ items = [], exporterId, ...data }: OrderForm) => ({
  ...data,
  items: items.map(({ batchItems, productExporterSupplier, ...item }) => ({
    ...item,
    productExporterSupplierId: productExporterSupplier.id,
    batchItems: batchItems.map(
      ({ hasShipment, hasBatchGroup, shipment, batchGroup, assignments, tags, ...batchItem }) => ({
        ...batchItem,
        tags: tags ? tags.map(t => t.id) : null,
        assignments: assignments.map(({ user, request, ...assign }) => ({
          userId: user.id,
          requestId: request ? request.id : null,
          ...assign,
        })),
      })
    ),
  })),
});
