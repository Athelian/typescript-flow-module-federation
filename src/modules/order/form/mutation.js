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
  batchItems: orderItems.map(({ batchItems, productExporterSupplier, ...orderItem }) => ({
    ...orderItem,
    productProviderId: productExporterSupplier.id,
    batches: batchItems.map(({ assignments, tags, ...batchItem }) => ({
      ...batchItem,
      tagIds: tags ? tags.map(t => t.id) : null,
      batchAssignments: assignments.map(({ user, ...assign }) => ({
        userId: user.id,
        ...assign,
      })),
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

export const prepareUpdateOrderInput = ({ orderItems = [], exporterId, ...data }: OrderForm) => ({
  ...data,
  batchItems: orderItems.map(({ batchItems, productExporterSupplier, ...orderItem }) => ({
    ...orderItem,
    productProviderId: productExporterSupplier.id,
    batchItems: batchItems.map(
      ({ hasShipment, hasBatchGroup, shipment, batchGroup, assignments, tags, ...batchItem }) => ({
        ...batchItem,
        tagIds: tags ? tags.map(t => t.id) : null,
        batchAssignments: assignments.map(({ user, ...assign }) => ({
          userId: user.id,
          ...assign,
        })),
      })
    ),
  })),
});
