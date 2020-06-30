// @flow
import { normalizeSheetInput } from 'modules/sheet/common/normalize';

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
            createdAt,
            order,
            orderItem,
            shipment,
            productProvider: pp,
            milestone,
            updatedAt,
            updatedBy,
            ...rest
          }) => ({
            ...rest,
            tagIds: tags.map(tag => tag.id),
          })
        ),
      };
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
