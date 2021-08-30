// @flow
import { normalizeSheetInput } from 'modules/sheet/common/normalize';
import { parseTagsField } from 'utils/data';

export default function normalizeSheetContainerInput(
  container: Object,
  field: string,
  oldValue: any,
  newValue: any
): Object {
  switch (field) {
    case 'warehouseArrivalAgreedDate':
    case 'warehouseArrivalActualDate':
    case 'departureDate':
      return {
        [(field: string)]: newValue || null,
      };
    case 'tags':
      return parseTagsField('tags', oldValue, newValue);
    case 'warehouseArrivalAgreedDateApproved':
      return {
        warehouseArrivalAgreedDateApprovedById: newValue?.user?.id ?? null,
      };
    case 'warehouseArrivalActualDateApproved':
      return {
        warehouseArrivalActualDateApprovedById: newValue?.user?.id ?? null,
      };
    case 'departureDateApproved':
      return {
        departureDateApprovedById: newValue?.user?.id ?? null,
      };
    case 'freeTimeStartDate': {
      return {
        autoCalculatedFreeTimeStartDate: newValue?.auto ?? false,
        freeTimeStartDate: newValue?.value || null,
      };
    }
    case 'warehouse':
      return {
        warehouseId: newValue?.id ?? null,
      };
    case 'mask':
      return {
        customFields: {
          maskId: newValue?.id ?? null,
        },
      };
    default:
      return normalizeSheetInput(container, field, newValue);
  }
}
