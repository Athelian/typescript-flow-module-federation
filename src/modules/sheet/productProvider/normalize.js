// @flow
import { normalizeSheetInput } from 'modules/sheet/common/normalize';
import { parseFilesField } from 'utils/data';

export default function normalizeSheetProductProviderInput(
  productProvider: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'unitPrice':
      if (newValue.value === null) {
        return { unitPrice: null };
      }
      return {
        unitPrice: {
          amount: newValue.value,
          currency: newValue.metric,
        },
      };
    case 'files': {
      const newFiles = parseFilesField({
        key: 'files',
        originalFiles: oldValue,
        newFiles: newValue,
        isNewFormat: true,
      });

      return newFiles;
    }
    case 'mask':
      return {
        customFields: {
          maskId: newValue?.id ?? null,
        },
      };
    default:
      return normalizeSheetInput(productProvider, field, newValue);
  }
}
