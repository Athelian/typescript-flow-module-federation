/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { FieldDefinition } from 'types';
import { colors } from 'styles/common';
import type { ColumnSortConfig, ColumnConfig } from 'components/Sheet/SheetState/types';
import productMessages from 'modules/product/messages';
import { ColumnWidths, populateColumns } from 'modules/sheet/common/columns';

const columns: Array<ColumnConfig> = [
  {
    key: 'product.name',
    title: <FormattedMessage {...productMessages.name} />,
    icon: 'PRODUCT',
    color: colors.PRODUCT,
    width: ColumnWidths.Default,
  },
  {
    key: 'product.serial',
    title: <FormattedMessage {...productMessages.serial} />,
    icon: 'PRODUCT',
    color: colors.PRODUCT,
    width: ColumnWidths.Default,
  },
  {
    key: 'product.material',
    title: <FormattedMessage {...productMessages.material} />,
    icon: 'PRODUCT',
    color: colors.PRODUCT,
    width: ColumnWidths.Default,
  },
  {
    key: 'product.mask',
    title: <FormattedMessage {...productMessages.mask} />,
    icon: 'PRODUCT',
    color: colors.PRODUCT,
    width: ColumnWidths.Default,
  },
];

export default function productColumns({
  columnsKeys,
  exportKeys,
  sorts = {},
  fieldDefinitions = [],
}: {
  columnsKeys: Array<string>,
  exportKeys: { [string]: string | Array<string> },
  sorts?: { [string]: ColumnSortConfig },
  fieldDefinitions?: Array<FieldDefinition>,
}): Array<ColumnConfig> {
  return [
    ...populateColumns(columns, exportKeys, sorts).map(column =>
      columnsKeys.includes(column.key) ? { ...column, isNew: false } : { ...column, isNew: true }
    ),
    ...fieldDefinitions.map(fieldDefinition => ({
      key: `product.customField.${fieldDefinition.id}`,
      exportKey:
        exportKeys['product.customField'] && !Array.isArray(exportKeys['product.customField'])
          ? `${exportKeys['product.customField']}.${fieldDefinition.id}`
          : undefined,
      title: fieldDefinition.name,
      icon: 'PRODUCT',
      color: colors.PRODUCT,
      width: ColumnWidths.Default,
    })),
  ];
}
