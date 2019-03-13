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
  taskCardFragment,
} from 'graphql';
import { prepareCustomFieldsData } from 'utils/customFields';
import { calculatePackageQuantity } from 'utils/batch';
import {
  parseGenericField,
  parseMemoField,
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
    totalVolume,
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
  ${taskCardFragment}
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
    totalVolume,
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
  originalValues: ?Object,
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
    ...(!inBatchForm && originalValues ? { id: originalValues.id } : {}),
    ...parseGenericField('no', getByPathWithDefault(null, 'no', originalValues), newValues.no),
    ...parseGenericField(
      'quantity',
      getByPathWithDefault(null, 'quantity', originalValues),
      newValues.quantity
    ),
    ...parseDateField(
      'deliveredAt',
      getByPathWithDefault(null, 'deliveredAt', originalValues),
      newValues.deliveredAt
    ),
    ...parseDateField(
      'desiredAt',
      getByPathWithDefault(null, 'desiredAt', originalValues),
      newValues.desiredAt
    ),
    ...parseDateField(
      'expiredAt',
      getByPathWithDefault(null, 'expiredAt', originalValues),
      newValues.expiredAt
    ),
    ...parseDateField(
      'producedAt',
      getByPathWithDefault(null, 'producedAt', originalValues),
      newValues.producedAt
    ),
    ...parseCustomFieldsField(
      'customFields',
      getByPathWithDefault(null, 'customFields', originalValues),
      newValues.customFields
    ),
    ...parseArrayOfIdsField(
      'tagIds',
      getByPathWithDefault([], 'tags', originalValues),
      newValues.tags
    ),
    ...parseMemoField('memo', getByPathWithDefault(null, 'memo', originalValues), newValues.memo),
    ...(inOrderForm
      ? {}
      : parseParentIdField(
          'orderItemId',
          getByPathWithDefault(null, 'orderItem', originalValues),
          newValues.orderItem
        )),
    ...(inShipmentForm || inContainerForm
      ? {}
      : parseParentIdField(
          'shipmentId',
          getByPathWithDefault(null, 'shipment', originalValues),
          newValues.shipment
        )),
    ...(inShipmentForm || inContainerForm
      ? {}
      : parseParentIdField(
          'containerId',
          getByPathWithDefault(null, 'container', originalValues),
          newValues.container
        )),
    ...parseArrayOfChildrenField(
      'batchAdjustments',
      getByPathWithDefault([], 'batchAdjustments', originalValues),
      newValues.batchAdjustments,
      (oldAdjustment: ?Object, newAdjustment: Object) => ({
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
        ...parseMemoField(
          'memo',
          getByPathWithDefault(null, 'memo', oldAdjustment),
          newAdjustment.memo
        ),
      })
    ),
    ...parseGenericField(
      'packageName',
      getByPathWithDefault(null, 'packageName', originalValues),
      newValues.packageName
    ),
    ...parseGenericField(
      'packageCapacity',
      getByPathWithDefault(null, 'packageCapacity', originalValues),
      newValues.packageCapacity
    ),
    ...parseGenericField(
      'packageQuantity',
      getByPathWithDefault(null, 'packageQuantity', originalValues),
      newValues.packageQuantity
    ),
    ...parseGenericField(
      'packageGrossWeight',
      getByPathWithDefault(null, 'packageGrossWeight', originalValues),
      newValues.packageGrossWeight
    ),
    ...parseGenericField(
      'packageVolume',
      getByPathWithDefault(null, 'packageVolume', originalValues),
      newValues.packageVolume
    ),
    ...parseGenericField(
      'packageSize',
      getByPathWithDefault(null, 'packageSize', originalValues),
      newValues.packageSize
    ),
    ...parseGenericField(
      'autoCalculatePackageQuantity',
      getByPathWithDefault(null, 'autoCalculatePackageQuantity', originalValues),
      newValues.autoCalculatePackageQuantity
    ),
  };
};
