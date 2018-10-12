// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { prepareUpdateBatchInput, prepareCreateBatchInput } from 'modules/batch/form/mutation';
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
  inCharges = [],
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
  currency: currency && currency.length > 0 ? currency : null,
  incoterm: incoterm && incoterm.length > 0 ? incoterm : null,
  deliveryPlace,
  memo,
  exporterId: exporter.id,
  issuedAt: issuedAt ? new Date(issuedAt) : null,
  tagIds: tags.map(({ id }) => id),
  inChargeIds: inCharges.map(({ id }) => id),
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, price, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      price: { ...price, currency },
      productProviderId: productProvider.id,
      batches: batches.map(batch => prepareCreateBatchInput(batch, false)),
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
  issuedAt = '',
  orderItems = [],
  files = [],
  tags = [],
  inCharges = [],
  exporter = {},
  poNo,
  currency,
  deliveryPlace,
  piNo,
  memo,
  incoterm,
  archived,
}: Object): OrderForm => ({
  poNo,
  currency: currency && currency.length > 0 ? currency : null,
  incoterm: incoterm && incoterm.length > 0 ? incoterm : null,
  deliveryPlace,
  piNo,
  memo,
  archived,
  exporterId: exporter.id,
  issuedAt: issuedAt ? new Date(issuedAt) : null,
  tagIds: tags.map(({ id: tagId }) => tagId),
  inChargeIds: inCharges.map(({ id: userId }) => userId),
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, price, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      ...(isNew ? {} : { id: itemId }),
      productProviderId: productProvider.id,
      price: { ...price, currency },
      batches: batches.map(batch => prepareUpdateBatchInput(batch, false, false)),
    })
  ),
  files: files.map(({ id, name, type, memo: fileMemo }) => ({
    id,
    name,
    type,
    memo: fileMemo,
  })),
});
