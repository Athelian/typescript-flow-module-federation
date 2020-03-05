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
    key: 'orderItem.followers',
    title: <FormattedMessage {...orderItemMessages.followers} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: ColumnWidths.Followers,
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
    key: 'orderItem.remainingBatchedQuantity',
    title: <FormattedMessage {...orderItemMessages.remainingBatchedQuantity} />,
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

const exportKeys = {
  'orderItem.created': ['orderItem.createdAt', 'orderItem.createdBy'],
  'orderItem.updated': ['orderItem.updatedAt', 'orderItem.updatedBy'],
  'orderItem.price': ['orderItem.price.amount', 'orderItem.price.currency'],
  'orderItem.totalPrice': ['orderItem.totalPrice.amount', 'orderItem.totalPrice.currency'],
  'orderItem.todo': [
    'orderItem.todo.taskCount.count',
    'orderItem.todo.taskCount.remain',
    'orderItem.todo.taskCount.inProgress',
    'orderItem.todo.taskCount.completed',
    'orderItem.todo.taskCount.rejected',
    'orderItem.todo.taskCount.approved',
    'orderItem.todo.taskCount.skipped',
    'orderItem.todo.taskCount.delayed',
  ],
};

export default function orderItemColumns({
  sorts = {},
  fieldDefinitions = [],
}: {
  sorts?: { [string]: ColumnSortConfig },
  fieldDefinitions?: Array<FieldDefinition>,
}): Array<ColumnConfig> {
  return [
    ...populateColumns(columns, exportKeys, sorts),
    ...fieldDefinitions.map(fieldDefinition => ({
      key: `orderItem.customField.${fieldDefinition.id}`,
      exportKey: `orderItem.customFields.${fieldDefinition.id}`,
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
