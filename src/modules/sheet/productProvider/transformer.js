// @flow
import type { CellValue } from 'components/Sheet/SheetState/types';
import { transformValueField, transformReadonlyField } from 'components/Sheet';
import {
  PRODUCT_PROVIDER_SET_NAME,
  PRODUCT_PROVIDER_UPDATE,
  PRODUCT_PROVIDER_SET_UNIT_PRICE,
  PRODUCT_PROVIDER_SET_DOCUMENTS,
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
    {
      columnKey: 'productProvider.files',
      type: 'product_provider_documents',
      ...transformValueField(
        basePath,
        productProvider,
        'files',
        hasPermission =>
          hasPermission(PRODUCT_PROVIDER_UPDATE) || hasPermission(PRODUCT_PROVIDER_SET_DOCUMENTS)
      ),
    },
  ];
}
