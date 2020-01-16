/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { ColumnSortConfig, ColumnConfig } from 'components/Sheet/SheetState/types';
import containerMessages from 'modules/container/messages';
import { ColumnWidths, populateColumns } from 'modules/sheet/common/columns';

const columns: Array<ColumnConfig> = [
  {
    key: 'container.created',
    title: <FormattedMessage {...containerMessages.createdAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'container.updated',
    title: <FormattedMessage {...containerMessages.updatedAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'container.archived',
    title: <FormattedMessage {...containerMessages.status} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Status,
  },
  {
    key: 'container.no',
    title: <FormattedMessage {...containerMessages.containerNo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.containerType',
    title: <FormattedMessage {...containerMessages.containerType} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Select,
  },
  {
    key: 'container.containerOption',
    title: <FormattedMessage {...containerMessages.containerOption} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Select,
  },
  {
    key: 'container.warehouseArrivalAgreedDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Date,
  },
  {
    key: 'container.warehouseArrivalAgreedDateAssignedTo',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Users,
  },
  {
    key: 'container.warehouseArrivalAgreedDateApproved',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'container.warehouseArrivalActualDate',
    exportKey: 'containers.warehouseArrivalActualDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Date,
  },
  {
    key: 'container.warehouseArrivalActualDateAssignedTo',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Users,
  },
  {
    key: 'container.warehouseArrivalActualDateApproved',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'container.warehouse',
    title: <FormattedMessage {...containerMessages.warehouse} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.freeTime',
    title: <FormattedMessage {...containerMessages.freeTime} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.freeTimeStartDate',
    title: <FormattedMessage {...containerMessages.startDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.freeTimeDuration',
    title: <FormattedMessage {...containerMessages.duration} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.dueDate',
    title: <FormattedMessage {...containerMessages.dueDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.yardName',
    title: <FormattedMessage {...containerMessages.yardName} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.departureDate',
    title: <FormattedMessage {...containerMessages.departureDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Date,
  },
  {
    key: 'container.departureDateAssignedTo',
    title: <FormattedMessage {...containerMessages.departureDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Users,
  },
  {
    key: 'container.departureDateApproved',
    title: <FormattedMessage {...containerMessages.departureDateApproved} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'container.tags',
    title: <FormattedMessage {...containerMessages.tags} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.memo',
    title: <FormattedMessage {...containerMessages.memo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.totalPrice',
    title: <FormattedMessage {...containerMessages.totalPrice} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.totalBatchQuantity',
    title: <FormattedMessage {...containerMessages.totalBatchQuantity} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.totalItems',
    title: <FormattedMessage {...containerMessages.totalUniqueItems} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.totalPackages',
    title: <FormattedMessage {...containerMessages.totalPackages} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.totalWeight',
    title: <FormattedMessage {...containerMessages.totalWeight} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.totalVolume',
    title: <FormattedMessage {...containerMessages.totalVolume} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Default,
  },
  {
    key: 'container.logs',
    title: <FormattedMessage {...containerMessages.logs} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: ColumnWidths.Logs,
  },
  // actions
];

export default function containerColumns({
  exportKeys,
  sorts = {},
}: {
  exportKeys: { [string]: string | Array<string> },
  sorts?: { [string]: ColumnSortConfig },
}): Array<ColumnConfig> {
  return populateColumns(columns, exportKeys, sorts);
}
