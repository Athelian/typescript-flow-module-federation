/* eslint-disable react/jsx-props-no-spreading */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { FieldDefinition } from 'types';
import { colors } from 'styles/common';
import type { ColumnSortConfig, ColumnConfig } from 'components/Sheet/SheetState/types';
import batchMessages from 'modules/batch/messages';
import { ColumnWidths, populateColumns } from 'modules/sheet/common/columns';

const columns: Array<ColumnConfig> = [
  {
    key: 'batch.created',
    title: <FormattedMessage {...batchMessages.createdAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'batch.updated',
    title: <FormattedMessage {...batchMessages.updatedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.DateUser,
  },
  {
    key: 'batch.archived',
    title: <FormattedMessage {...batchMessages.status} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Status,
  },
  {
    key: 'batch.no',
    title: <FormattedMessage {...batchMessages.batchNo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.deliveredAt',
    title: <FormattedMessage {...batchMessages.deliveredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.desiredAt',
    title: <FormattedMessage {...batchMessages.desiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.expiredAt',
    title: <FormattedMessage {...batchMessages.expiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.producedAt',
    title: <FormattedMessage {...batchMessages.producedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.tags',
    title: <FormattedMessage {...batchMessages.tags} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.memo',
    title: <FormattedMessage {...batchMessages.memo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.latestQuantity',
    title: <FormattedMessage {...batchMessages.currentQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.quantity',
    title: <FormattedMessage {...batchMessages.initialQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.producedQuantity',
    title: <FormattedMessage {...batchMessages.producedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.preShippedQuantity',
    title: <FormattedMessage {...batchMessages.preShippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.shippedQuantity',
    title: <FormattedMessage {...batchMessages.shippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.postShippedQuantity',
    title: <FormattedMessage {...batchMessages.postShippedQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.deliveredQuantity',
    title: <FormattedMessage {...batchMessages.deliveredQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.packageName',
    title: <FormattedMessage {...batchMessages.packageName} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.packageCapacity',
    title: <FormattedMessage {...batchMessages.packageCapacity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.packageQuantity',
    title: <FormattedMessage {...batchMessages.packageQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 250,
  },
  {
    key: 'batch.packageGrossWeight',
    title: <FormattedMessage {...batchMessages.packageGrossWeight} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.packageVolume',
    title: <FormattedMessage {...batchMessages.packageVolume} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.packageSize',
    title: <FormattedMessage {...batchMessages.packageSizeGrouped} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 280,
  },
  {
    key: 'batch.todo',
    title: <FormattedMessage {...batchMessages.tasks} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
  {
    key: 'batch.logs',
    title: <FormattedMessage {...batchMessages.logs} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Logs,
  },
  {
    key: 'batch.mask',
    title: <FormattedMessage {...batchMessages.mask} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: ColumnWidths.Default,
  },
];

export default function batchColumns(
  exportKeys: { [string]: string },
  sorts: { [string]: ColumnSortConfig },
  fieldDefinitions: Array<FieldDefinition>
): Array<ColumnConfig> {
  return [
    ...populateColumns(columns, exportKeys, sorts),
    ...fieldDefinitions.map(fieldDefinition => ({
      key: `batch.customField.${fieldDefinition.id}`,
      exportKey: exportKeys['batch.customField']
        ? `${exportKeys['batch.customField']}.${fieldDefinition.id}`
        : undefined,
      title: fieldDefinition.name,
      icon: 'BATCH',
      color: colors.BATCH,
      width: ColumnWidths.Default,
    })),
  ];
}
