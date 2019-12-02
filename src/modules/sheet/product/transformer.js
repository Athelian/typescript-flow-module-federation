// @flow
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import { transformCustomField, transformField, transformValueField } from 'components/Sheet';
import {
  PRODUCT_SET_CUSTOM_FIELDS,
  PRODUCT_SET_CUSTOM_FIELDS_MASK,
  PRODUCT_SET_NAME,
  PRODUCT_SET_SERIAL,
  PRODUCT_SET_MATERIAL,
  PRODUCT_UPDATE,
} from 'modules/permission/constants/product';

type Props = {|
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  product: ?Object,
  getProductFromRoot: Object => ?Object,
|};

export default function transformSheetProduct({
  fieldDefinitions,
  basePath,
  product,
  getProductFromRoot,
}: Props): Array<CellValue> {
  return [
    {
      columnKey: 'product.name',
      type: 'text',
      ...transformValueField(
        basePath,
        product,
        'name',
        hasPermission => hasPermission(PRODUCT_UPDATE) || hasPermission(PRODUCT_SET_NAME)
      ),
    },
    {
      columnKey: 'product.serial',
      type: 'text',
      ...transformValueField(
        basePath,
        product,
        'serial',
        hasPermission => hasPermission(PRODUCT_UPDATE) || hasPermission(PRODUCT_SET_SERIAL)
      ),
    },
    {
      columnKey: 'product.material',
      type: 'text',
      ...transformValueField(
        basePath,
        product,
        'material',
        hasPermission => hasPermission(PRODUCT_UPDATE) || hasPermission(PRODUCT_SET_MATERIAL)
      ),
    },
    {
      columnKey: 'product.mask',
      type: 'mask',
      extra: { entityType: 'Product' },
      ...transformField(
        product,
        `${basePath}.customFields.mask`,
        'mask',
        product?.customFields?.mask ?? null,
        hasPermission =>
          hasPermission(PRODUCT_UPDATE) || hasPermission(PRODUCT_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `product.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: root => {
        const currentProduct = getProductFromRoot(root);
        const mask = currentProduct?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        product,
        fieldDefinition.id,
        hasPermission => hasPermission(PRODUCT_UPDATE) || hasPermission(PRODUCT_SET_CUSTOM_FIELDS)
      ),
    })),
  ];
}
