// @flow
import { parseTodoField, removeTypename, extractForbiddenId } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetBatchInput(
  batch: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'desiredAt':
    case 'expiredAt':
    case 'deliveredAt':
    case 'producedAt':
      return {
        [(field: string)]: newValue ? new Date(newValue) : null,
      };
    case 'packageQuantity': {
      const { auto: autoCalculatePackageQuantity = false, value: packageQuantity = 0 } =
        newValue || {};
      return {
        autoCalculatePackageQuantity,
        packageQuantity,
      };
    }
    case 'packageGrossWeight':
      return {
        packageGrossWeight: newValue ? removeTypename(newValue) : null,
      };
    case 'packageVolume': {
      const { auto: autoCalculatePackageVolume = false, value: packageVolume = 0 } = newValue || {};
      return {
        autoCalculatePackageVolume,
        packageVolume: removeTypename(packageVolume),
      };
    }
    case 'packageSize':
      return {
        packageSize: newValue ? removeTypename(newValue) : null,
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
      return normalizeSheetInput(batch, field, newValue);
  }
}
