// @flow
import { parseTodoField, removeTypename, parseTagsField, parseFilesField } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetOrderItemInput(
  orderItem: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'price':
      if (newValue.value === null) {
        return { price: null };
      }
      return {
        price: {
          amount: newValue.value,
          currency: newValue.metric,
        },
      };
    case 'deliveryDate':
      return {
        deliveryDate: newValue ? new Date(newValue) : null,
      };
    case 'tags':
      return parseTagsField('tags', oldValue, newValue);
    case 'files': {
      const newFiles = parseFilesField({
        key: 'files',
        originalFiles: oldValue,
        newFiles: newValue,
        isNewFormat: true,
      });

      return newFiles;
    }
    case 'todo':
      return parseTodoField(removeTypename(oldValue), removeTypename(newValue));
    case 'mask':
      return {
        customFields: {
          maskId: newValue?.id ?? null,
        },
      };
    default:
      return normalizeSheetInput(orderItem, field, newValue);
  }
}
