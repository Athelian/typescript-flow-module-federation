// @flow
import gql from 'graphql-tag';
import {
  ownedByFragment,
  itemFormFragment,
  priceFragment,
  tagFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskCountFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
  partnerCardFragment,
  metricFragment,
  sizeFragment,
  imageFragment,
  batchFormFragment,
  userAvatarFragment,
  customFieldsFragment,
  maskFragment,
  fieldDefinitionFragment,
  fieldValuesFragment,
  itemInBatchFormFragment,
  shipmentCardFragment,
  orderCardFragment,
  portFragment,
  timelineDateMinimalFragment,
  productProviderCardFragment,
  documentFragment,
  badRequestFragment,
  forbiddenFragment,
  productProviderPackagingFragment,
} from 'graphql';
import {
  parseGenericField,
  parseParentIdField,
  parseArrayOfIdsField,
  parseArrayOfChildrenField,
  parseFilesField,
  parseCustomFieldsField,
  parseTodoField,
  parseMemoField,
  parseDateField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';
import { prepareParsedBatchInput } from 'modules/batch/form/mutation';

export const updateOrderItemMutation = gql`
  mutation orderItemUpdate($id: ID!, $input: OrderItemUpdateInput!) {
    orderItemUpdate(id: $id, input: $input) {
      ...itemFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${ownedByFragment}
  ${itemFormFragment}
  ${priceFragment}
  ${tagFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskCountFragment}
  ${taskWithoutParentInfoFragment}
  ${taskFormInTemplateFragment}
  ${taskTemplateCardFragment}
  ${partnerNameFragment}
  ${metricFragment}
  ${sizeFragment}
  ${imageFragment}
  ${batchFormFragment}
  ${userAvatarFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldDefinitionFragment}
  ${fieldValuesFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${shipmentCardFragment}
  ${orderCardFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${productProviderCardFragment}
  ${documentFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
`;

export const prepareParseOrderItem = (originalValues: Object, newValues: Object): Object => ({
  ...parseParentIdField(
    'productProviderId',
    getByPathWithDefault(null, 'productProvider', originalValues),
    newValues.productProvider
  ),
  ...parseGenericField('no', getByPathWithDefault(null, 'no', originalValues), newValues.no),
  ...parseGenericField(
    'quantity',
    getByPathWithDefault(null, 'quantity', originalValues),
    newValues.quantity
  ),
  ...parseDateField('deliveryDate', originalValues?.deliveryDate, newValues.deliveryDate),
  ...parseArrayOfIdsField(
    'tagIds',
    getByPathWithDefault([], 'tags', originalValues),
    newValues.tags
  ),
  ...parseMemoField('memo', getByPathWithDefault(null, 'memo', originalValues), newValues.memo),
  ...parseArrayOfChildrenField(
    'batches',
    getByPathWithDefault([], 'batches', originalValues),
    newValues.batches,
    (oldBatch: ?Object, newBatch: Object) =>
      prepareParsedBatchInput(oldBatch, newBatch, {
        inOrderItemForm: true,
      })
  ),
  ...parseFilesField({
    key: 'files',
    originalFiles: getByPathWithDefault([], 'files', originalValues),
    newFiles: newValues.files,
  }),
  ...parseCustomFieldsField(
    'customFields',
    getByPathWithDefault(null, 'customFields', originalValues),
    newValues.customFields
  ),
  ...parseTodoField(
    getByPathWithDefault(
      { tasks: [], taskTemplate: null, milestone: null },
      'todo',
      originalValues
    ),
    newValues.todo
  ),
});

export const prepareParseOrderItemInput = ({
  originalValues,
  newValues,
}: {
  originalValues: Object,
  newValues: Object,
}): Object => ({
  ...prepareParseOrderItem(originalValues, newValues),
  ...parseGenericField('price', originalValues?.price, newValues.price),
  ...parseParentIdField(
    'orderId',
    getByPathWithDefault(null, 'order', originalValues),
    newValues.order
  ),
});
