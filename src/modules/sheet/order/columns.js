/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { FieldDefinition } from 'types';
import { colors } from 'styles/common';
import type { ColumnSortConfig, ColumnConfig } from 'components/Sheet/SheetState/types';
import orderMessages from 'modules/order/messages';
import { ColumnWidths, populateColumns } from 'modules/sheet/common/columns';

const columns: Array<ColumnConfig> = [
  {
    key: 'order.created',
    title: <FormattedMessage {...orderMessages.createdAt} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'order.updated',
    title: <FormattedMessage {...orderMessages.updatedAt} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'order.archived',
    title: <FormattedMessage {...orderMessages.status} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Status,
  },
  {
    key: 'order.poNo',
    title: <FormattedMessage {...orderMessages.PO} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.importer',
    title: <FormattedMessage {...orderMessages.importer} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.exporter',
    title: <FormattedMessage {...orderMessages.exporter} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.piNo',
    exportKey: 'piNo',
    title: <FormattedMessage {...orderMessages.PI} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.issuedAt',
    exportKey: 'issuedAt',
    title: <FormattedMessage {...orderMessages.date} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Date,
  },
  {
    key: 'order.deliveryDate',
    exportKey: 'deliveryDate',
    title: <FormattedMessage {...orderMessages.deliveryDate} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Date,
  },
  {
    key: 'order.currency',
    exportKey: 'currency',
    title: <FormattedMessage {...orderMessages.currency} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Select,
  },
  {
    key: 'order.incoterm',
    exportKey: 'incoterm',
    title: <FormattedMessage {...orderMessages.incoterm} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Select,
  },
  {
    key: 'order.deliveryPlace',
    exportKey: 'deliveryPlace',
    title: <FormattedMessage {...orderMessages.deliveryPlace} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.tags',
    exportKey: 'tags',
    title: <FormattedMessage {...orderMessages.tags} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.memo',
    exportKey: 'memo',
    title: <FormattedMessage {...orderMessages.memo} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.inCharges',
    title: <FormattedMessage {...orderMessages.inCharge} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Users,
  },
  {
    key: 'order.totalOrdered',
    title: <FormattedMessage {...orderMessages.totalOrderedQuantity} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.totalBatched',
    title: <FormattedMessage {...orderMessages.totalBatchedQuantity} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.totalShipped',
    title: <FormattedMessage {...orderMessages.totalShippedQuantity} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.totalPrice',
    title: <FormattedMessage {...orderMessages.totalPrice} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.files',
    title: <FormattedMessage {...orderMessages.sectionDocuments} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.todo',
    title: <FormattedMessage {...orderMessages.tasks} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
  {
    key: 'order.logs',
    title: <FormattedMessage {...orderMessages.logs} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Logs,
  },
  {
    key: 'order.mask',
    title: <FormattedMessage {...orderMessages.mask} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: ColumnWidths.Default,
  },
];

export default function orderColumns(
  exportKeys: { [string]: string },
  sorts: { [string]: ColumnSortConfig },
  fieldDefinitions: Array<FieldDefinition>
): Array<ColumnConfig> {
  return [
    ...populateColumns(columns, exportKeys, sorts),
    ...fieldDefinitions.map(fieldDefinition => ({
      key: `order.customField.${fieldDefinition.id}`,
      exportKey: exportKeys['order.customField']
        ? `${exportKeys['order.customField']}.${fieldDefinition.id}`
        : undefined,
      title: fieldDefinition.name,
      icon: 'ORDER',
      color: colors.ORDER,
      width: ColumnWidths.Default,
    })),
    {
      key: 'order.action',
      title: 'Actions',
      icon: 'ORDER',
      color: colors.ORDER,
      width: 200,
    },
  ];
}
