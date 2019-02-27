// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  batchFormFragment,
  userAvatarFragment,
  metricFragment,
  sizeFragment,
  tagFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
} from 'graphql';
import { prepareCustomFieldsData } from 'utils/customFields';
import { calculatePackageQuantity } from 'utils/batch';
import type { BatchCreate, BatchUpdate } from '../type.js.flow';

export const createBatchMutation = gql`
  mutation batchCreate($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      ... on Batch {
        id
      }
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const formatBatchInput = (state: Object, option?: Object) => {
  const { autoCalculatePackageQuantity } = option || {};
  return {
    ...state,
    packageQuantity: autoCalculatePackageQuantity
      ? calculatePackageQuantity(state)
      : state.packageQuantity,
  };
};

export const prepareCreateBatchInput = (
  {
    id,
    isNew,
    container,
    shipment = {},
    tags = [],
    batchAdjustments = [],
    totalAdjusted,
    orderItem = {},
    deliveredAt,
    desiredAt,
    expiredAt,
    customFields,
    producedAt,
    ownedBy,
    ...rest
  }: Object,
  inShipmentOrBatchForm: boolean = true
): BatchCreate => ({
  ...rest,
  ...(shipment ? { shipmentId: shipment.id } : {}),
  ...(container ? { containerId: container.id } : {}),
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
      ...batchFormFragment
      ...badRequestFragment
    }
  }

  ${batchFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${partnerCardFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${badRequestFragment}
  ${ownedByFragment}
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
    container,
    deliveredAt,
    desiredAt,
    expiredAt,
    customFields,
    producedAt,
    ownedBy,
    tags = [],
    batchAdjustments = [],
    totalAdjusted,
    archived,
    ...rest
  }: Object,
  inShipmentOrBatchForm: boolean = true,
  inBatchForm: boolean = true
): BatchUpdate => ({
  ...rest,
  ...(shipment && !inShipmentOrBatchForm ? { shipmentId: shipment.id } : {}),
  ...(container && !inShipmentOrBatchForm ? { containerId: container.id } : {}),
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
