/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { FieldDefinition } from 'types';
import { colors } from 'styles/common';
import type { ColumnSortConfig, ColumnConfig } from 'components/Sheet/SheetState/types';
import orderItemMessages from 'modules/orderItem/messages';
import { ColumnWidths, populateColumns } from 'modules/sheet/common/columns';

const columns: Array<ColumnConfig> = [
  {
    key: 'orderItem.created',
    title: <FormattedMessage {...orderItemMessages.createdAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'orderItem.updated',
    title: <FormattedMessage {...orderItemMessages.updatedAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'orderItem.archived',
    title: <FormattedMessage {...orderItemMessages.status} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Status,
  },
  {
    key: 'orderItem.no',
    title: <FormattedMessage {...orderItemMessages.no} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.quantity',
    title: <FormattedMessage {...orderItemMessages.quantity} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.price',
    title: <FormattedMessage {...orderItemMessages.unitPrice} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.deliveryDate',
    title: <FormattedMessage {...orderItemMessages.deliveryDate} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Date,
  },
  {
    key: 'orderItem.tags',
    title: <FormattedMessage {...orderItemMessages.tags} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.memo',
    title: <FormattedMessage {...orderItemMessages.memo} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.totalBatched',
    title: <FormattedMessage {...orderItemMessages.totalBatched} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.remainingBatchQuantity',
    title: <FormattedMessage {...orderItemMessages.remainingBatchQuantity} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.totalShipped',
    title: <FormattedMessage {...orderItemMessages.totalShipped} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.remainingShippedQuantity',
    title: <FormattedMessage {...orderItemMessages.remainingShippedQuantity} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.totalPrice',
    title: <FormattedMessage {...orderItemMessages.totalPrice} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.files',
    title: <FormattedMessage {...orderItemMessages.sectionDocuments} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.todo',
    title: <FormattedMessage {...orderItemMessages.tasks} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
  {
    key: 'orderItem.logs',
    title: <FormattedMessage {...orderItemMessages.logs} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Logs,
  },
  {
    key: 'orderItem.mask',
    title: <FormattedMessage {...orderItemMessages.mask} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Default,
  },
];

export default function orderItemColumns(
  exportKeys: { [string]: string },
  sorts: { [string]: ColumnSortConfig },
  fieldDefinitions: Array<FieldDefinition>
): Array<ColumnConfig> {
  return [
    ...populateColumns(columns, exportKeys, sorts),
    ...fieldDefinitions.map(fieldDefinition => ({
      key: `orderItem.customField.${fieldDefinition.id}`,
      exportKey: exportKeys['orderItem.customField']
        ? `${exportKeys['orderItem.customField']}.${fieldDefinition.id}`
        : undefined,
      title: fieldDefinition.name,
      icon: 'ORDER_ITEM',
      color: colors.ORDER_ITEM,
      width: ColumnWidths.Default,
    })),
    {
      key: 'orderItem.action',
      title: 'Actions',
      icon: 'ORDER_ITEM',
      color: colors.ORDER_ITEM,
      width: 200,
    },
  ];
}
