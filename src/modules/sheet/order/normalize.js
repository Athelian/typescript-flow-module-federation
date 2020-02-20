// @flow
import { parseTodoField, removeTypename, extractForbiddenId } from 'utils/data';
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
        [(field: string)]: newValue ? new Date(newValue) : null,
      };
    case 'files':
      return {
        files: newValue.map(
          ({
            __typename,
            entity: e,
            ownedBy,
            tags,
            path,
            uploading,
            progress,
            size,
            isNew,
            ...rest
          }) => rest
        ),
      };
    case 'tags':
      return {
        tagIds: newValue.map(tag => extractForbiddenId(tag).id).filter(Boolean),
      };
    case 'todo':
      return removeTypename(parseTodoField(oldValue, newValue));
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
