// @flow
import * as React from 'react';
import { useAuthenticated } from 'contexts/Viewer';
import { getCache, invalidateCache, setCache } from 'utils/cache';
import type { ColumnConfig } from './SheetState/types';

export const SHEET_COLUMN_KEY_PREFIX = 'zenport_sheet_columns';

export function getColumnsConfigured(
  columns: Array<ColumnConfig>,
  configuration: { [string]: boolean }
): Array<ColumnConfig> {
  const keysOrder = Object.keys(configuration);

  const orderedColumns = columns
    .map(col => ({
      ...col,
      isNew: !keysOrder.includes(col.key),
      hidden: !!configuration[col.key] || !keysOrder.includes(col.key),
    }))
    .sort((a, b) => {
      if (a.isNew && !b.isNew) {
        return 1;
      }

      if (!a.isNew && b.isNew) {
        return -1;
      }

      const aIdx = keysOrder.indexOf(a.key);
      const bIdx = keysOrder.indexOf(b.key);
      if (aIdx > bIdx) {
        return 1;
      }
      if (bIdx > aIdx) {
        return -1;
      }
      return 0;
    });

  const groupedColumns = orderedColumns.reduce(
    (grouped, col) => ({
      ...grouped,
      [col.icon]: [...(grouped[col.icon] ?? []), col],
    }),
    {}
  );

  // $FlowFixMe: flat
  return Object.values(groupedColumns).flat();
}

function getColumnsCache(key: string, columns: Array<ColumnConfig>): Array<ColumnConfig> | null {
  const cache = getCache<{ [string]: boolean }>(SHEET_COLUMN_KEY_PREFIX, key);
  if (!cache || !typeof cache === 'object') {
    return null;
  }

  return getColumnsConfigured(columns, cache);
}

function setColumnsCache(key: string, columns: Array<ColumnConfig>) {
  setCache(
    SHEET_COLUMN_KEY_PREFIX,
    key,
    columns.reduce((cache, col) => ({ ...cache, [col.key]: !!col.hidden }), {})
  );
}

export function useColumnsInvalidator() {
  const { authenticated } = useAuthenticated();

  React.useEffect(() => {
    if (authenticated) {
      return;
    }

    invalidateCache(SHEET_COLUMN_KEY_PREFIX);
  }, [authenticated]);
}

export default function useColumns(
  columns: Array<ColumnConfig>,
  cacheKey: ?string
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
