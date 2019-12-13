// @flow
import * as React from 'react';
import type { SortDirection } from 'types';
import type { ColumnState } from './SheetState/types';

export default function useExportedColumns(
  columns: Array<ColumnState>
): {| columns: Array<string>, localSortBy: Array<{ field: string, direction: SortDirection }> |} {
  return React.useMemo(
    () => ({
      localSortBy: columns.reduce((localSortBy, column) => {
        if (!column.hidden && column.sort) {
          const { sort } = column;
          if (sort.local && !!sort.direction) {
            localSortBy.push({
              field: `${sort.group}_${sort.name}`,
              direction: sort.direction,
            });
          }
        }

        return localSortBy;
      }, []),
      columns: columns.reduce((exportKeys, column) => {
        if (!column.hidden && !!column.exportKey) {
          exportKeys.push(
            ...(Array.isArray(column.exportKey) ? column.exportKey : [column.exportKey])
          );
        }

        return exportKeys;
      }, []),
    }),
    [columns]
  );
}
