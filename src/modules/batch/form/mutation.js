// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { prepareCustomFieldsData } from 'utils/customFields';
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
    shipment = {},
    tags = [],
    batchAdjustments = [],
    orderItem = {},
    deliveredAt,
    desiredAt,
    expiredAt,
    customFields,
    producedAt,
    ...rest
  }: Object,
  inShipmentOrBatchForm: boolean = true
): BatchCreate => ({
  ...rest,
  ...(shipment ? { shipmentId: shipment.id } : {}),
  ...(inShipmentOrBatchForm ? { orderItemId: orderItem.id } : {}),
  deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
  desiredAt: desiredAt ? new Date(desiredAt) : null,
  expiredAt: expiredAt ? new Date(expiredAt) : null,
  producedAt: producedAt ? new Date(producedAt) : null,
  customFields: prepareCustomFieldsData(customFields),
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
    desiredAt,
    expiredAt,
    customFields,
    producedAt,
    tags = [],
    batchAdjustments = [],
    archived,
    ...rest
  }: Object,
  inShipmentOrBatchForm: boolean = true,
  inBatchForm: boolean = true
): BatchUpdate => ({
  ...rest,
  ...(shipment && !inShipmentOrBatchForm ? { shipmentId: shipment.id } : {}),
  ...(inShipmentOrBatchForm ? { orderItemId: orderItem.id } : {}),
  ...(!inBatchForm && !isNew ? { id } : {}),
  deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
  desiredAt: desiredAt ? new Date(desiredAt) : null,
  expiredAt: expiredAt ? new Date(expiredAt) : null,
  customFields: prepareCustomFieldsData(customFields),
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
