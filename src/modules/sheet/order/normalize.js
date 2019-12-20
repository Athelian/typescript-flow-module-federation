// @flow
import { parseTodoField } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetOrderInput(
  order: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'deliveryDate':
    case 'issuedAt':
      return {
        [(field: string)]: new Date(newValue),
      };
    case 'files':
      return {
        files: newValue.map(
          ({ __typename, entity: e, ownedBy, path, uploading, progress, ...rest }) => rest
        ),
      };
    case 'tags':
      return {
        tagIds: newValue.map(tag => tag.id),
      };
    case 'inCharges':
      return {
        inChargeIds: newValue.map(user => user.id),
      };
    case 'todo':
      return parseTodoField(oldValue, newValue);
    case 'mask':
      return {
        customFields: {
          maskId: newValue?.id ?? null,
        },
      };
    default:
      return normalizeSheetInput(order, field, newValue);
  }
}
