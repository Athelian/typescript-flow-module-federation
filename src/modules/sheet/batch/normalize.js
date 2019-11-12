// @flow
import { parseTodoField, removeTypename } from 'utils/data';
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

export default function normalizeSheetBatchInput(batch: Object, field: string, value: any): Object {
  switch (field) {
    case 'desiredAt':
    case 'expiredAt':
    case 'deliveredAt':
    case 'producedAt':
      return {
        [(field: string)]: new Date(value),
      };
    case 'batchQuantityRevisions':
      return {
        batchQuantityRevisions: value.map(({ sort, batch: b, ...revision }) =>
          removeTypename(revision)
        ),
      };
    case 'packageQuantity': {
      const { auto: autoCalculatePackageQuantity = false, value: packageQuantity = 0 } =
        value || {};
      return {
        autoCalculatePackageQuantity,
        packageQuantity,
      };
    }
    case 'packageGrossWeight':
      return {
        packageGrossWeight: value ? removeTypename(value) : null,
      };
    case 'packageVolume': {
      const { auto: autoCalculatePackageVolume = false, value: packageVolume = 0 } = value || {};
      return {
        autoCalculatePackageVolume,
        packageVolume: removeTypename(packageVolume),
      };
    }
    case 'packageSize':
      return {
        packageSize: value ? removeTypename(value) : null,
      };
    case 'tags':
      return {
        tagIds: value.map(tag => tag.id),
      };
    case 'todo':
      return parseTodoField(null, value);
    default:
      return normalizeSheetInput(batch, field, value);
  }
}
