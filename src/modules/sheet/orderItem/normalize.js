// @flow
import { parseTodoField } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetOrderItemInput(
  orderItem: Object,
  field: string,
  value: any
): Object {
  switch (field) {
    case 'price':
      if (value.value === null) {
        return { price: null };
      }
      return {
        price: {
          amount: value.value,
          currency: value.metric,
        },
      };
    case 'deliveryDate':
      return {
        deliveryDate: new Date(value),
      };
    case 'tags':
      return {
        tagIds: value.map(tag => tag.id),
      };
    case 'files':
      return {
        files: value.map(({ __typename, entity: e, path, uploading, progress, ...rest }) => rest),
      };
    case 'todo':
      return parseTodoField(null, value);
    default:
      return normalizeSheetInput(orderItem, field, value);
  }
}
