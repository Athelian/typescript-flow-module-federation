// @flow
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  transformCustomField,
  transformField,
  transformValueField,
  transformReadonlyField,
} from 'components/Sheet';
import {
  PRODUCT_PROVIDER_SET_CUSTOM_FIELDS,
  PRODUCT_PROVIDER_SET_CUSTOM_FIELDS_MASK,
  PRODUCT_PROVIDER_SET_NAME,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_SET_UNIT_PRICE,
} from 'modules/permission/constants/product';

type Props = {|
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  productProvider: ?Object,
  getProductProviderFromRoot: Object => ?Object,
|};

export default function transformSheetProductProvider({
  fieldDefinitions,
  basePath,
  productProvider,
  getProductProviderFromRoot,
}: Props): Array<CellValue> {
  return [
    {
      columnKey: 'productProvider.supplier',
      type: 'partner',
      ...transformReadonlyField(
        basePath,
        productProvider,
        'supplier',
        productProvider?.supplier ?? null
      ),
    },
    {
      columnKey: 'productProvider.name',
      type: 'text',
      ...transformValueField(
        basePath,
        productProvider,
        'name',
        hasPermission =>
          hasPermission(PRODUCT_PROVIDER_UPDATE) || hasPermission(PRODUCT_PROVIDER_SET_NAME)
      ),
    },
    {
      columnKey: 'productProvider.unitPrice',
      type: 'price',
      ...transformValueField(
        basePath,
        productProvider,
        'unitPrice',
        hasPermission =>
          hasPermission(PRODUCT_PROVIDER_UPDATE) || hasPermission(PRODUCT_PROVIDER_SET_UNIT_PRICE)
      ),
    },
    {
      columnKey: 'productProvider.mask',
      type: 'mask',
      extra: { entityType: 'ProductProvider' },
      ...transformField(
        productProvider,
        `${basePath}.customFields.mask`,
        'mask',
        productProvider?.customFields?.mask ?? null,
        hasPermission =>
          hasPermission(PRODUCT_PROVIDER_UPDATE) ||
          hasPermission(PRODUCT_PROVIDER_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `productProvider.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: root => {
        const currentProductProvider = getProductProviderFromRoot(root);
        const mask = currentProductProvider?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        productProvider,
        fieldDefinition.id,
        hasPermission =>
          hasPermission(PRODUCT_PROVIDER_UPDATE) ||
          hasPermission(PRODUCT_PROVIDER_SET_CUSTOM_FIELDS)
      ),
    })),
  ];
}
