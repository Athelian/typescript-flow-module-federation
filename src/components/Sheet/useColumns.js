// @flow
import * as React from 'react';
import { useAuthenticated } from 'contexts/Viewer';
import { getCache, invalidateCache, setCache } from 'utils/cache';
import type { ColumnConfig } from './SheetState/types';

const KEY_PREFIX = 'zenport_sheet_columns';
const WIDTH_KEY_PREFIX = 'zenport_sheet_column_widths';

function getColumnsCache(key: string, columns: Array<ColumnConfig>): Array<ColumnConfig> | null {
  const cache = getCache<Array<ColumnConfig>>(KEY_PREFIX, key);
  if (!cache) {
    return null;
  }

  // $FlowFixMe
  return cache.map(columnKey => columns.find(c => c.key === columnKey)).filter(c => !!c);
}

function setColumnsCache(key: string, columns: Array<ColumnConfig>) {
  setCache(
    KEY_PREFIX,
    key,
    columns.map(c => c.key)
  );
}

export function useColumnsInvalidator() {
  const { authenticated } = useAuthenticated();

  React.useEffect(() => {
    if (authenticated) {
      return;
    }

    invalidateCache(KEY_PREFIX);
  }, [authenticated]);
}

export default function useColumns(
  columns: Array<ColumnConfig>,
  cacheKey: string
): [Array<ColumnConfig>, (Array<ColumnConfig>) => void] {
  const [currentColumns, setCurrentColumns] = React.useState<Array<ColumnConfig> | null>(null);

  React.useEffect(() => {
    if (!cacheKey || !currentColumns) {
      return;
    }

    setColumnsCache(cacheKey, currentColumns);
  }, [currentColumns, cacheKey]);

  function getColumns() {
    if (!currentColumns) {
      let value = columns;

      if (cacheKey) {
        const cache = getColumnsCache(cacheKey, columns);
        if (cache) {
          value = cache;
        }
      }

      setCurrentColumns(value);

      return value;
    }

    return currentColumns;
  }

  return [getColumns(), setCurrentColumns];
}

export function useResizedColumns(
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
      setCache(WIDTH_KEY_PREFIX, cacheKey, columnWidths);
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
        (cacheKey && getCache<{ [string]: number }>(WIDTH_KEY_PREFIX, cacheKey)) || {}
      );
    }

    return resizedColumns;
  }

  return [getResizedColumns(), onColumnResize];
}
