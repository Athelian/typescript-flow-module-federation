// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { prepareUpdateBatchInput, prepareCreateBatchInput } from 'modules/batch/form/mutation';
import { orderDetailFragment } from 'modules/order/form/query';
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
  files = [],
  exporter = {},
  tags = [],
  issuedAt = '',
  poNo,
  currency,
  deliveryPlace,
  piNo,
  memo,
  incoterm,
}: Object): OrderForm => ({
  poNo,
  piNo,
  currency,
  deliveryPlace,
  memo,
  incoterm,
  exporterId: exporter.id,
  issuedAt: issuedAt ? new Date(issuedAt) : null,
  tagIds: tags.map(({ id }) => id),
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      productProviderId: productProvider.id,
      batches: batches.map(prepareCreateBatchInput),
    })
  ),
  files: files.map(({ id, name, type, memo: fileMemo }) => ({
    id,
    name,
    type,
    memo: fileMemo,
  })),
});

export const updateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      order {
        ...orderDetailFragment
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${orderDetailFragment}
  ${violationFragment}
`;

export const prepareUpdateOrderInput = ({
  issuedAt = '',
  orderItems = [],
  files = [],
  tags = [],
  exporter = {},
  poNo,
  currency,
  deliveryPlace,
  piNo,
  memo,
  incoterm,
}: Object): OrderForm => ({
  poNo,
  currency,
  deliveryPlace,
  piNo,
  memo,
  incoterm,
  exporterId: exporter.id,
  issuedAt: issuedAt ? new Date(issuedAt) : null,
  tagIds: tags.map(({ id: tagId }) => tagId),
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      ...(isNew ? {} : { id: itemId }),
      productProviderId: productProvider.id,
      batches: batches.map(batch => prepareUpdateBatchInput(batch, false)),
    })
  ),
  files: files.map(({ id, name, type, memo: fileMemo }) => ({
    id,
    name,
    type,
    memo: fileMemo,
  })),
});
