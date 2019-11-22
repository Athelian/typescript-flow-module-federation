// @flow

import type { ColumnConfig, ColumnSortConfig } from 'components/Sheet/SheetState/types';

export const ColumnWidths = {
  Default: 200,
  Date: 125,
  DateUser: 110,
  DateRevisions: 1125,
  Partners: 825,
  Status: 120,
  Select: 100,
  Users: 160,
  Logs: 120,
};

export function populateColumns(
  columns: Array<ColumnConfig>,
  exportKeys: { [string]: string },
  sorts: { [string]: ColumnSortConfig }
): Array<ColumnConfig> {
  return columns.map(c => ({
    ...c,
    exportKey: exportKeys[c.key] ?? null,
    sort: sorts[c.key] ?? null,
  }));
}
