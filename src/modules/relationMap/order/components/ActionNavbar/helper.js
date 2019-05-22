// @flow
import {
  parseParentIdField,
  parseArrayOfIdsField,
  parseMemoField,
  parseGenericField,
  parseArrayOfChildrenField,
  parseFilesField,
  parseCustomFieldsField,
  parseTodoField,
  parseEnumField,
  removeTypename,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';
import { prepareParsedBatchInput } from 'modules/batch/form/mutation';

export const prepareOrderItem = (originalValues: Object, newValues: Object): Object => ({
  ...parseParentIdField(
    'productProviderId',
    getByPathWithDefault(null, 'productProvider', originalValues),
    getByPathWithDefault(null, 'productProvider', newValues)
  ),
  ...parseGenericField(
    'no',
    getByPathWithDefault(null, 'no', originalValues),
    getByPathWithDefault(null, 'no', newValues)
  ),
  ...parseGenericField(
    'quantity',
    getByPathWithDefault(null, 'quantity', originalValues),
    getByPathWithDefault(null, 'quantity', newValues)
  ),
  ...parseArrayOfIdsField(
    'tagIds',
    getByPathWithDefault([], 'tags', originalValues),
    getByPathWithDefault([], 'tags', newValues)
  ),
  ...parseMemoField(
    'memo',
    getByPathWithDefault(null, 'memo', originalValues),
    getByPathWithDefault(null, 'memo', newValues)
  ),
  ...parseArrayOfChildrenField(
    'batches',
    getByPathWithDefault([], 'batches', originalValues),
    getByPathWithDefault([], 'batches', newValues),
    (oldBatch: ?Object, newBatch: Object) =>
      prepareParsedBatchInput(oldBatch, newBatch, {
        inOrderItemForm: true,
      })
  ),
  ...parseFilesField(
    'files',
    getByPathWithDefault([], 'files', originalValues),
    getByPathWithDefault([], 'files', newValues)
  ),
  ...parseCustomFieldsField(
    'customFields',
    getByPathWithDefault(null, 'customFields', originalValues),
    getByPathWithDefault(null, 'customFields', newValues)
  ),
  ...parseTodoField(
    getByPathWithDefault({ tasks: [], taskTemplate: null }, 'todo', originalValues),
    getByPathWithDefault({ tasks: [], taskTemplate: null }, 'todo', newValues)
  ),
});

export const prepareOrderInput = (oldValues: ?Object, currentValues: Object): Object => {
  const originalValues = removeTypename(oldValues);
  const newValues = removeTypename(currentValues);
  return {
    ...parseEnumField(
      'currency',
      getByPathWithDefault(null, 'currency', originalValues),
      getByPathWithDefault(null, 'currency', newValues)
    ),
    ...parseArrayOfChildrenField(
      'orderItems',
      getByPathWithDefault([], 'orderItems', originalValues),
      getByPathWithDefault([], 'orderItems', newValues),
      (oldItem: ?Object, newItem: Object) => ({
        ...(!oldItem ? {} : { id: oldItem.id }),
        ...parseGenericField('price', getByPathWithDefault(null, 'price', oldItem), {
          amount: newItem.price.amount,
          currency: getByPathWithDefault(null, 'currency', newValues),
        }),
        ...prepareOrderItem(oldItem, newItem),
      })
    ),
  };
};

export default prepareOrderInput;
