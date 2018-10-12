// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import type { BatchCreate, BatchUpdate } from '../type.js.flow';

export const createBatchMutation = gql`
  mutation batchCreate($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      batch {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const prepareCreateBatchInput = (
  {
    id,
    isNew,
    no,
    quantity,
    shipment = {},
    tags = [],
    batchAdjustments = [],
    orderItem = {},
    deliveredAt,
    expiredAt,
    producedAt,
    ...rest
  }: Object,
  inShipmentOrBatchForm: boolean = true
): BatchCreate => ({
  ...rest,
  no,
  quantity,
  deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
  expiredAt: expiredAt ? new Date(expiredAt) : null,
  producedAt: producedAt ? new Date(producedAt) : null,
  ...(shipment ? { shipmentId: shipment.id } : {}),
  ...(inShipmentOrBatchForm ? { orderItemId: orderItem.id } : {}),
  tagIds: tags.map(({ id: tagId }) => tagId),
  batchAdjustments: batchAdjustments.map(
    ({
      isNew: isNewAdjustment,
      id: adjustmentId,
      updatedAt: adjustmentUpdatedAt,
      ...adjustment
    }) => ({
      ...adjustment,
      ...(isNewAdjustment ? {} : { id: adjustmentId }),
    })
  ),
});

export const updateBatchMutation = gql`
  mutation batchUpdate($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      batch {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const prepareUpdateBatchInput = (
  {
    id,
    isNew,
    createdAt,
    updatedAt,
    updatedBy,
    orderItem,
    shipment,
    deliveredAt,
    expiredAt,
    producedAt,
    tags = [],
    batchAdjustments = [],
    archived,
    ...rest
  }: Object,
  inShipmentOrBatchForm: boolean = false,
  inBatchForm: boolean = true
): BatchUpdate => ({
  ...rest,
  ...(shipment && !inShipmentOrBatchForm ? { shipmentId: shipment.id } : {}),
  ...(inShipmentOrBatchForm ? { orderItemId: orderItem.id } : {}),
  ...(!inBatchForm && !isNew ? { id } : {}),
  deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
  expiredAt: expiredAt ? new Date(expiredAt) : null,
  producedAt: producedAt ? new Date(producedAt) : null,
  tagIds: tags.map(({ id: tagId }) => tagId),
  batchAdjustments: batchAdjustments.map(
    ({
      isNew: isNewAdjustment,
      id: adjustmentId,
      createdAt: adjustmentCreatedAt,
      updatedAt: adjustmentUpdateAt,
      updatedBy: adjustmentUpdatedBy,
      sort,
      ...adjustment
    }) => ({
      ...adjustment,
      ...(isNewAdjustment ? {} : { id: adjustmentId }),
    })
  ),
});
