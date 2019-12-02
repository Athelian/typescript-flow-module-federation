// @flow
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetProductInput(
  product: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'mask':
      return {
        customFields: {
          maskId: newValue?.id ?? null,
        },
      };
    default:
      return normalizeSheetInput(product, field, newValue);
  }
}
