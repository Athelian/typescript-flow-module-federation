// @flow
import * as React from 'react';
import { useAuthenticated } from 'contexts/Viewer';
import { getCache, invalidateCache, setCache } from 'utils/cache';
import type { ColumnConfig } from './SheetState/types';

const SHEET_WIDTH_KEY_PREFIX = 'zenport_sheet_column_widths';

export function useResizedColumnsInvalidator() {
  const { authenticated } = useAuthenticated();

  React.useEffect(() => {
    if (authenticated) {
      return;
    }

    invalidateCache(SHEET_WIDTH_KEY_PREFIX);
  }, [authenticated]);
}

export default function useResizedColumns(
  columns: Array<ColumnConfig>,
  cacheKey: string
): [Array<ColumnConfig>, (key: string, width: number) => void] {
  const [columnWidths, setColumnWidths] = React.useState<{ [string]: number } | null>(null);
  const resizedColumns = React.useMemo(() => {
    if (!columnWidths) {
      return columns;
    }

    return columns.map(col => ({ ...col, width: columnWidths[col.key] || col.width }));
  }, [columns, columnWidths]);

  React.useEffect(() => {
    if (columnWidths) {
      setCache(SHEET_WIDTH_KEY_PREFIX, cacheKey, columnWidths);
    }
  }, [cacheKey, columnWidths]);

  const onColumnResize = React.useCallback(
    (key: string, width: number) =>
      setColumnWidths({
        ...(columnWidths || {}),
        [key]: width,
      }),
    [columnWidths]
  );

  function getResizedColumns() {
    if (!columnWidths) {
      setColumnWidths(
        (cacheKey && getCache<{ [string]: number }>(SHEET_WIDTH_KEY_PREFIX, cacheKey)) || {}
      );
    }

    return resizedColumns;
  }

  return [getResizedColumns(), onColumnResize];
}
