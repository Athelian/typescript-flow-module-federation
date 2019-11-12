// @flow
import { parseTodoField } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetOrderInput(order: Object, field: string, value: any): Object {
  switch (field) {
    case 'deliveryDate':
    case 'issuedAt':
      return {
        [(field: string)]: new Date(value),
      };
    case 'files':
      return {
        files: value.map(({ __typename, entity: e, path, uploading, progress, ...rest }) => rest),
      };
    case 'tags':
      return {
        tagIds: value.map(tag => tag.id),
      };
    case 'inCharges':
      return {
        inChargeIds: value.map(user => user.id),
      };
    case 'todo':
      return parseTodoField(null, value);
    default:
      return normalizeSheetInput(order, field, value);
  }
}
