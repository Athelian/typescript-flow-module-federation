// @flow
import gql from 'graphql-tag';
import {
  orderFormFragment,
  userAvatarFragment,
  tagFragment,
  partnerCardFragment,
  documentFragment,
  shipmentCardFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  timelineDateMinimalFragment,
  portFragment,
  batchFormFragment,
  metricFragment,
  sizeFragment,
  orderCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskCountFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  containerCardFragment,
  itemInOrderFormFragment,
  itemInBatchFormFragment,
  forbiddenFragment,
  productProviderPackagingFragment,
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
  parseFilesField,
  parseTodoField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';
import { prepareParseOrderItem } from 'modules/orderItem/form/mutation';
import type { OrderForm } from '../type.js.flow';

export const createOrderMutation = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate(input: $input) {
      ... on Order {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const updateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...orderFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${orderFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${documentFragment}
  ${shipmentCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${badRequestFragment}
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
  ${containerCardFragment}
  ${itemInOrderFormFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
`;

export const prepareParsedOrderInput = (originalValues: ?Object, newValues: Object): OrderForm => ({
  ...parseGenericField('poNo', getByPathWithDefault(null, 'poNo', originalValues), newValues.poNo),
  ...parseGenericField('piNo', getByPathWithDefault(null, 'piNo', originalValues), newValues.piNo),
  ...parseDateField(
    'issuedAt',
    getByPathWithDefault(null, 'issuedAt', originalValues),
    newValues.issuedAt
  ),
  ...parseDateField(
    'deliveryDate',
    getByPathWithDefault(null, 'deliveryDate', originalValues),
    newValues.deliveryDate
  ),
  ...parseEnumField(
    'currency',
    getByPathWithDefault(null, 'currency', originalValues),
    newValues.currency
  ),
  ...parseEnumField(
    'incoterm',
    getByPathWithDefault(null, 'incoterm', originalValues),
    newValues.incoterm
  ),
  ...parseGenericField(
    'deliveryPlace',
    getByPathWithDefault(null, 'deliveryPlace', originalValues),
    newValues.deliveryPlace
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
  ...parseParentIdField(
    'exporterId',
    getByPathWithDefault(null, 'exporter', originalValues),
    newValues.exporter
  ),
  ...parseArrayOfChildrenField(
    'orderItems',
    getByPathWithDefault([], 'orderItems', originalValues),
    newValues.orderItems,
    (oldItem: ?Object, newItem: Object) => ({
      ...(!oldItem || oldItem?.isNew ? {} : { id: oldItem.id }),
      ...parseGenericField('price', getByPathWithDefault(null, 'price', oldItem), {
        amount: newItem.price.amount,
        currency: newValues.currency,
      }),
      ...prepareParseOrderItem(oldItem, newItem),
    })
  ),
  ...parseFilesField('files', getByPathWithDefault(null, 'files', originalValues), newValues.files),
  ...parseTodoField(
    getByPathWithDefault(
      { tasks: [], taskTemplate: null, milestone: null },
      'todo',
      originalValues
    ),
    newValues.todo
  ),
});
