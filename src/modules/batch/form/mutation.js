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
import {
  parseGenericField,
  parseDateField,
  parseEnumField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseArrayOfChildrenField,
  parseCustomFieldsField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';
import type { BatchCreate, BatchUpdate, BatchQuery } from '../type.js.flow';

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

export const prepareParsedUpdateBatchInput = (
  originalValues: Object,
  newValues: Object,
  location: {
    inShipmentForm: boolean,
    inOrderForm: boolean,
    inContainerForm: boolean,
    inBatchForm: boolean,
  }
): BatchQuery => {
  const { inShipmentForm, inOrderForm, inContainerForm, inBatchForm } = location;

  return {
    ...(inBatchForm ? {} : parseParentIdField('id', originalValues, newValues)),
    ...parseGenericField('no', originalValues.no, newValues.no),
    ...parseGenericField('quantity', originalValues.quantity, newValues.quantity),
    ...parseDateField('deliveredAt', originalValues.deliveredAt, newValues.deliveredAt),
    ...parseDateField('desiredAt', originalValues.desiredAt, newValues.desiredAt),
    ...parseDateField('expiredAt', originalValues.expiredAt, newValues.expiredAt),
    ...parseDateField('producedAt', originalValues.producedAt, newValues.producedAt),
    ...parseCustomFieldsField('customFields', originalValues.customFields, newValues.customFields),
    ...parseArrayOfIdsField('tagIds', originalValues.tags, newValues.tags),
    ...parseGenericField('memo', originalValues.memo, newValues.memo),
    ...(inOrderForm
      ? {}
      : parseParentIdField('orderItemId', originalValues.orderItem, newValues.orderItem)),
    ...(inShipmentForm || inContainerForm
      ? {}
      : parseParentIdField('shipmentId', originalValues.shipment, newValues.shipment)),
    ...(inShipmentForm || inContainerForm
      ? {}
      : parseParentIdField('containerId', originalValues.container, newValues.container)),
    ...parseArrayOfChildrenField(
      'batchAdjustments',
      originalValues.batchAdjustments,
      newValues.batchAdjustments,
      (oldAdjustment: ?Object, newAdjustment: Object) => {
        return {
          ...(!oldAdjustment ? {} : { id: oldAdjustment.id }),
          ...parseGenericField(
            'quantity',
            getByPathWithDefault(null, 'quantity', oldAdjustment),
            newAdjustment.quantity
          ),
          ...parseEnumField(
            'reason',
            getByPathWithDefault(null, 'reason', oldAdjustment),
            newAdjustment.reason
          ),
          ...parseGenericField(
            'memo',
            getByPathWithDefault(null, 'memo', oldAdjustment),
            newAdjustment.memo
          ),
        };
      }
    ),
    ...parseGenericField('packageName', originalValues.packageName, newValues.packageName),
    ...parseGenericField(
      'packageCapacity',
      originalValues.packageCapacity,
      newValues.packageCapacity
    ),
    ...parseGenericField(
      'packageQuantity',
      originalValues.packageQuantity,
      newValues.packageQuantity
    ),
    ...parseGenericField('packageWeight', originalValues.packageWeight, newValues.packageWeight),
    ...parseGenericField('packageVolume', originalValues.packageVolume, newValues.packageVolume),
    ...parseGenericField('packageSize', originalValues.packageSize, newValues.packageSize),
    ...parseGenericField(
      'autoCalculatePackageQuantity',
      originalValues.autoCalculatePackageQuantity,
      newValues.autoCalculatePackageQuantity
    ),
  };
};
