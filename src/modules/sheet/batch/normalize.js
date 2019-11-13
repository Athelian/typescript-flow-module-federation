// @flow
import { parseTodoField, removeTypename } from 'utils/data';
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
        [(field: string)]: new Date(newValue),
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
        tagIds: newValue.map(tag => tag.id),
      };
    case 'todo':
      return parseTodoField(oldValue, newValue);
    default:
      return normalizeSheetInput(batch, field, newValue);
  }
}
