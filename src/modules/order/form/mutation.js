// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { productProviderListFragment } from 'graphql/productProviderList/fragment';
import { detailedBatchFragment } from 'graphql/batchDetail/fragment';
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
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      productProviderId: productProvider.id,
      batches: batches.map(
        ({ isNew: isNewBatch, id: batchId, assignments, tags: tagsArr = [], ...batch }) => ({
          ...batch,
          ...(isNewBatch ? {} : { id: batchId }),
          tagIds: tagsArr ? tagsArr.map(t => t.id) : null,
        })
      ),
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
  orderItems: orderItems.map(
    ({ batches = [], productProvider = {}, isNew, id: itemId, ...orderItem }) => ({
      ...orderItem,
      ...(isNew ? {} : { id: itemId }),
      productProviderId: productProvider.id,
      batches: batches.map(
        ({
          isNew: isNewBatch,
          id: batchId,
          assignments,
          tags: tagsArr = [],
          shipment = {},
          updatedBy,
          createdAt: batchCreatedAt,
          updatedAt: batchUpdateAt,
          orderItem: batchOrderItem,
          ...batch
        }) => ({
          ...batch,
          ...(isNewBatch ? {} : { id: batchId }),
          shipmentId: shipment && shipment.id,
          tagIds: tagsArr ? tagsArr.map(t => t.id) : null,
        })
      ),
    })
  ),
});
