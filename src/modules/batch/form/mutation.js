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
  taskFormInSlideViewFragment,
  todoFragment,
} from 'graphql';
import {
  parseGenericField,
  parseMemoField,
  parseDateField,
  parseEnumField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseArrayOfChildrenField,
  parseCustomFieldsField,
  parseTasksField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

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
  ${taskFormInSlideViewFragment}
  ${todoFragment}
`;

export const prepareParsedBatchInput = (
  originalValues: ?Object,
  newValues: Object,
  location: {
    inShipmentForm: boolean,
    inOrderForm: boolean,
    inContainerForm: boolean,
    inBatchForm: boolean,
  }
): Object => {
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
    ...parseTasksField(getByPathWithDefault({ tasks: [] }, 'todo', originalValues), newValues.todo),
  };
};
