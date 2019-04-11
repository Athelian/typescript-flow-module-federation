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
  taskFormInSlideViewFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
} from 'graphql';
import { prepareParsedBatchInput } from 'modules/batch/form/mutation';
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
import type { OrderForm } from '../type.js.flow';

export const createOrderMutation = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate(input: $input) {
      ... on Order {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const updateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...orderFormFragment
      ...badRequestFragment
    }
  }

  ${orderFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${partnerCardFragment}
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
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
`;

export const prepareParsedOrderInput = (originalValues: ?Object, newValues: Object): OrderForm => ({
  ...parseGenericField('poNo', getByPathWithDefault(null, 'poNo', originalValues), newValues.poNo),
  ...parseGenericField('piNo', getByPathWithDefault(null, 'piNo', originalValues), newValues.piNo),
  ...parseDateField(
    'issuedAt',
    getByPathWithDefault(null, 'issuedAt', originalValues),
    newValues.issuedAt
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
  ...parseArrayOfIdsField(
    'inChargeIds',
    getByPathWithDefault([], 'inCharges', originalValues),
    newValues.inCharges
  ),
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
      ...(!oldItem ? {} : { id: oldItem.id }),
      ...parseParentIdField(
        'productProviderId',
        getByPathWithDefault(null, 'productProvider', oldItem),
        newItem.productProvider
      ),
      ...parseGenericField(
        'quantity',
        getByPathWithDefault(null, 'quantity', oldItem),
        newItem.quantity
      ),
      ...parseGenericField('price', getByPathWithDefault(null, 'price', oldItem), {
        amount: newItem.price.amount,
        currency: newValues.currency,
      }),
      ...parseArrayOfChildrenField(
        'batches',
        getByPathWithDefault([], 'batches', oldItem),
        newItem.batches,
        (oldBatch: ?Object, newBatch: Object) =>
          prepareParsedBatchInput(oldBatch, newBatch, {
            inOrderForm: true,
            inBatchForm: false,
            inContainerForm: false,
            inShipmentForm: false,
          })
      ),
    })
  ),
  ...parseFilesField('files', getByPathWithDefault(null, 'files', originalValues), newValues.files),
  ...parseTodoField(
    getByPathWithDefault({ tasks: [], taskTemplate: null }, 'todo', originalValues),
    newValues.todo
  ),
});
