// @flow
import * as React from 'react';
import type { SortBy } from 'types';
import type { ColumnConfig } from './SheetState/types';
import useLocalSort from './useLocalSort';

type Input = {
  columns: Array<ColumnConfig>,
  sortBy: SortBy,
  setSortBy: SortBy => void,
  cacheKey: string,
};

export default function useSortedColumns({
  columns,
  sortBy,
  setSortBy,
  cacheKey,
}: Input): [Array<ColumnConfig>, (key: string) => void] {
  const sortableColumnsRef = React.useRef(columns);
  const [localSortBy, setLocalSortBy] = useLocalSort(cacheKey);

  const sortedColumns = React.useMemo(
    () =>
      columns.map(column => {
        if (column.sort) {
          const { sort } = column;

          if (sort.local) {
            const localSort = localSortBy.find(ls => ls.field === `${sort.group}_${sort.name}`);
            if (localSort) {
              return {
                ...column,
                sort: {
                  ...sort,
                  direction: localSort.direction,
                },
              };
            }
          } else {
            const remoteSortDirection = sortBy[sort.name];
            if (remoteSortDirection) {
              return {
                ...column,
                sort: {
                  ...sort,
                  direction: remoteSortDirection,
                },
              };
            }
          }
        }

        return column;
      }),
    [columns, sortBy, localSortBy]
  );

  React.useEffect(() => {
    const previousSortableColumns = sortableColumnsRef.current;
    const sortableColumns = sortedColumns.filter(c => !c.hidden && !!c.sort);
    sortableColumnsRef.current = sortableColumns;

    const sortableColumnKeys = sortableColumns.map(c => c.key);
    if (!previousSortableColumns.some(c => !sortableColumnKeys.includes(c.key))) {
      return;
    }

    const activeSorts = sortableColumns.filter(c => !!c.sort?.direction).map(c => c.sort);
    const activeSortGroups = new Set(activeSorts.map(s => s?.group));
    const sortGroups = new Set(sortableColumns.map(c => c.sort?.group));

    if (activeSortGroups.size !== sortGroups.size) {
      activeSortGroups.forEach(g => sortGroups.delete(g));

      sortGroups.forEach(g => {
        let newSortOfGroup = sortableColumns
          .map(c => c.sort)
          .find(s => s?.group === g && s?.default);
        if (!newSortOfGroup) {
          newSortOfGroup = sortableColumns.map(c => c.sort).find(s => s?.group === g);
        }

        if (newSortOfGroup) {
          if (newSortOfGroup.local) {
            setLocalSortBy([
              ...localSortBy,
              { field: `${newSortOfGroup.group}_${newSortOfGroup.name}`, direction: 'DESCENDING' },
            ]);
          } else {
            setSortBy({
              [newSortOfGroup.name]: 'DESCENDING',
            });
          }
        }
      });
    }
  }, [sortedColumns, localSortBy, setLocalSortBy, setSortBy]);

  const onColumnSort = React.useCallback(
    (key: string) => {
      const column = sortedColumns.find(c => c.key === key);
      if (!column || !column.sort) {
        return;
      }
      const { sort } = column;

      if (sort.local) {
        const previousLocalSort = localSortBy.find(ls => ls.field === `${sort.group}_${sort.name}`);

        setLocalSortBy([
          ...localSortBy.filter(ls => !ls.field.startsWith(sort.group)),
          {
            field: `${sort.group}_${sort.name}`,
            direction: previousLocalSort?.direction === 'DESCENDING' ? 'ASCENDING' : 'DESCENDING',
          },
        ]);
      } else {
        setSortBy({
          [sort.name]: sortBy[sort.name] === 'DESCENDING' ? 'ASCENDING' : 'DESCENDING',
        });
      }
    },
    [sortedColumns, sortBy, setSortBy, localSortBy, setLocalSortBy]
  );

  return [sortedColumns, onColumnSort];
}
