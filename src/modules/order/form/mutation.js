// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { productProviderListFragment } from 'graphql/productProviderList/fragment';
import { detailedBatchFragment } from 'graphql/batchDetail/fragment';
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
});

export const updateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      order {
        id
        archived
        poNo
        issuedAt
        piNo
        incoterm
        deliveryPlace
        currency
        memo
        createdAt
        updatedAt
        tags {
          id
          name
          color
        }
        orderItems {
          id
          quantity
          price {
            amount
            currency
          }
          productProvider {
            ...productProviderListFragment
          }
          batches {
            ...detailedBatchFragment
          }
        }
        exporter {
          id
          name
        }
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${productProviderListFragment}
  ${detailedBatchFragment}
  ${violationFragment}
`;

export const prepareUpdateOrderInput = ({
  issuedAt = '',
  orderItems = [],
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
      batches: batches.map(prepareUpdateBatchInput),
    })
  ),
});
