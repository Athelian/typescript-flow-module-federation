/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { FieldDefinition } from 'types';
import { colors } from 'styles/common';
import type { ColumnSortConfig, ColumnConfig } from 'components/Sheet/SheetState/types';
import messages from 'modules/productProvider/messages';
import { ColumnWidths, populateColumns } from 'modules/sheet/common/columns';

const columns: Array<ColumnConfig> = [
  {
    key: 'productProvider.supplier',
    title: <FormattedMessage {...messages.supplier} />,
    icon: 'PRODUCT_PROVIDER',
    color: colors.PRODUCT_PROVIDER,
    width: ColumnWidths.Partner,
  },
  {
    key: 'productProvider.name',
    title: <FormattedMessage {...messages.name} />,
    icon: 'PRODUCT_PROVIDER',
    color: colors.PRODUCT_PROVIDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'productProvider.unitPrice',
    title: <FormattedMessage {...messages.unitPrice} />,
    icon: 'PRODUCT_PROVIDER',
    color: colors.PRODUCT_PROVIDER,
    width: ColumnWidths.Default,
  },
];

const exportKeys = {
  'productProvider.supplier': ['productProvider.supplier', 'productProvider.supplierCode'],
  'productProvider.unitPrice': [
    'productProvider.unitPrice.amount',
    'productProvider.unitPrice.currency',
  ],
};

export default function productProviderColumns({
  sorts = {},
  fieldDefinitions = [],
}: {
  sorts?: { [string]: ColumnSortConfig },
  fieldDefinitions?: Array<FieldDefinition>,
}): Array<ColumnConfig> {
  return [
    ...populateColumns(columns, exportKeys, sorts),
    ...fieldDefinitions.map(fieldDefinition => ({
      key: `productProvider.customField.${fieldDefinition.id}`,
      exportKey: `productProvider.customFields.${fieldDefinition.id}`,
      title: fieldDefinition.name,
      icon: 'PRODUCT_PROVIDER',
      color: colors.PRODUCT_PROVIDER,
      width: ColumnWidths.Default,
    })),
  ];
}
