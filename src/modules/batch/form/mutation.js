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
  partnerCardFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskCountFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
  forbiddenFragment,
  productProviderPackagingFragment,
} from 'graphql';
import {
  parseGenericField,
  parseMemoField,
  parseDatetimeField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseCustomFieldsField,
  parseTodoField,
  parseSizeField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

export const updateBatchMutation = gql`
  mutation batchUpdate($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      ...batchFormFragment
      ...badRequestFragment
      ...forbiddenFragment
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
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskCountFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
`;

export const prepareParsedBatchInput = (
  originalValues: ?Object,
  newValues: Object,
  location: {
    inShipmentForm?: boolean,
    inOrderForm?: boolean,
    inContainerForm?: boolean,
    inBatchForm?: boolean,
    inOrderItemForm?: boolean,
  }
): Object => {
  const {
    inShipmentForm = false,
    inOrderForm = false,
    inContainerForm = false,
    inBatchForm = false,
    inOrderItemForm = false,
  } = location;

  return {
    ...(!inBatchForm && originalValues ? { id: originalValues.id } : {}),
    ...parseGenericField('no', getByPathWithDefault(null, 'no', originalValues), newValues.no),
    ...parseGenericField(
      'quantity',
      getByPathWithDefault(null, 'quantity', originalValues),
      newValues.quantity
    ),
    ...parseGenericField(
      'producedQuantity',
      getByPathWithDefault(null, 'producedQuantity', originalValues),
      newValues.producedQuantity
    ),
    ...parseGenericField(
      'preShippedQuantity',
      getByPathWithDefault(null, 'preShippedQuantity', originalValues),
      newValues.preShippedQuantity
    ),
    ...parseGenericField(
      'shippedQuantity',
      getByPathWithDefault(null, 'shippedQuantity', originalValues),
      newValues.shippedQuantity
    ),
    ...parseGenericField(
      'postShippedQuantity',
      getByPathWithDefault(null, 'postShippedQuantity', originalValues),
      newValues.postShippedQuantity
    ),
    ...parseGenericField(
      'deliveredQuantity',
      getByPathWithDefault(null, 'deliveredQuantity', originalValues),
      newValues.deliveredQuantity
    ),
    ...parseDatetimeField(
      'deliveredAt',
      originalValues?.deliveredAt ?? null,
      newValues.deliveredAt
    ),
    ...parseDatetimeField('desiredAt', originalValues?.desiredAt ?? null, newValues.desiredAt),
    ...parseDatetimeField('expiredAt', originalValues?.expiredAt ?? null, newValues.expiredAt),
    ...parseDatetimeField('producedAt', originalValues?.producedAt ?? null, newValues.producedAt),
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
    ...(inOrderForm || inOrderItemForm
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
    ...parseSizeField(
      'packageSize',
      getByPathWithDefault(null, 'packageSize', originalValues),
      newValues.packageSize
    ),
    ...parseGenericField(
      'autoCalculatePackageQuantity',
      getByPathWithDefault(null, 'autoCalculatePackageQuantity', originalValues),
      newValues.autoCalculatePackageQuantity
    ),
    ...parseGenericField(
      'autoCalculatePackageVolume',
      getByPathWithDefault(null, 'autoCalculatePackageVolume', originalValues),
      newValues.autoCalculatePackageVolume
    ),
    ...parseTodoField(
      getByPathWithDefault(
        { tasks: [], taskTemplate: null, milestone: null },
        'todo',
        originalValues
      ),
      newValues.todo
    ),
  };
};
