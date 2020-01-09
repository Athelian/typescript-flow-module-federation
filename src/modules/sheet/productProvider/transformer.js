// @flow
import type { CellValue } from 'components/Sheet/SheetState/types';
import { transformValueField, transformReadonlyField } from 'components/Sheet';
import {
  PRODUCT_PROVIDER_SET_NAME,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_SET_UNIT_PRICE,
} from 'modules/permission/constants/product';

type Props = {|
  basePath: string,
  productProvider: ?Object,
|};

export default function transformSheetProductProvider({
  basePath,
  productProvider,
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
  ];
}
