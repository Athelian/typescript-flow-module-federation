// @flow
import * as React from 'react';
import type { SortBy } from 'types';
import type { ColumnConfig, ColumnState } from './SheetState/types';
import useColumns from './useColumns';
import useSortedColumns from './useSortedColumns';
import useResizedColumns from './useResizedColumns';

type Input = {
  columns: Array<ColumnConfig>,
  sortBy: SortBy,
  setSortBy: SortBy => void,
  cacheKey: string,
};

type Output = {
  columns: Array<ColumnConfig>,
  columnStates: Array<ColumnState>,
  setColumns: (Array<ColumnConfig>) => void,
};

export default function useColumnStates({ columns, sortBy, setSortBy, cacheKey }: Input): Output {
  const [currentColumns, setCurrentColumns] = useColumns(columns, cacheKey);
  const [currentResizedColumns, onColumnResize] = useResizedColumns(currentColumns, cacheKey);
  const [currentSortableResizedColumns, onColumnSort] = useSortedColumns({
    columns: currentResizedColumns,
    sortBy,
    setSortBy,
    cacheKey,
  });

  const columnStates = React.useMemo(
    () =>
      currentSortableResizedColumns.map(column => ({
        ...column,
        onResize: width => onColumnResize(column.key, width),
        sort: column.sort
          ? {
              ...column.sort,
              onToggle: () => onColumnSort(column.key),
            }
          : undefined,
      })),
    [currentSortableResizedColumns, onColumnResize, onColumnSort]
  );

  return {
    columns: currentSortableResizedColumns,
    columnStates,
    setColumns: setCurrentColumns,
  };
}
