// @flow
import { normalizeSheetInput } from 'modules/sheet/common/normalize';
import { extractForbiddenId } from 'utils/data';

export default function normalizeSheetContainerInput(
  container: Object,
  field: string,
  newValue: any
): Object {
  switch (field) {
    case 'departureDate':
      return {
        [(field: string)]: newValue ? new Date(newValue) : null,
      };
    case 'tags':
      return {
        tagIds: newValue.map(tag => extractForbiddenId(tag).id).filter(Boolean),
      };
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
      const { auto: autoCalculatedFreeTimeStartDate = false, value: date = null } = newValue || {};
      return {
        autoCalculatedFreeTimeStartDate,
        freeTimeStartDate: date ? new Date(date) : null,
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
