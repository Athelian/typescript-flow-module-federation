// @flow
import * as React from 'react';

export type SortDirection = 'ASCENDING' | 'DESCENDING';

export type ColumnSortConfig = {
  local?: boolean,
  group: string,
  name: string,
  default?: boolean,
};

type Column = {
  key: string,
  title: any,
  icon: string,
  color: string,
  width: number,
  minWidth?: number,
};

export type ColumnConfig = {
  sort?: ColumnSortConfig,
} & Column;

export type ColumnSort = {
  key: string,
  direction?: SortDirection,
} & ColumnSortConfig;

export type ColumnState = {
  sort?: ColumnSort,
} & Column;

type ColumnWidth = {
  key: string,
  width: number,
};

type Context = {
  columns: Array<ColumnState>,
  onColumnSortToggle: (key: string) => void,
  onColumnResize: (key: string, width: number) => void,
};

type Props = {
  columns: Array<ColumnConfig>,
  children: React.Node,
};

export const SheetColumnsContext = React.createContext<Context>({
  columns: [],
  onColumnSortToggle: () => {},
  onColumnResize: () => {},
});

export const useSheetColumns = (): Context => React.useContext(SheetColumnsContext);

export const SheetColumns = ({ columns, children }: Props) => {
  const [sorts, setSorts] = React.useState<Array<ColumnSort>>([]);
  const [widths, setWidths] = React.useState<Array<ColumnWidth>>([]);
  const [columnStates, setColumnStates] = React.useState<Array<ColumnState>>([]);

  /**
   * This effect ensure an active for each column sort group.
   * If a sort is missing for a group, it will try get the default or pick the first of the group.
   */
  React.useEffect(() => {
    const validSorts = sorts.filter(s => !!columns.find(c => c.key === s.key));

    const sortGroups = new Set(validSorts.map(s => s.group));
    const columnGroups = new Set(columns.filter(c => !!c.sort).map(c => c.sort?.group));
    if (sortGroups.size === columnGroups.size) {
      return;
    }

    sortGroups.forEach(g => columnGroups.delete(g));

    console.log('missing', columnGroups);

    columnGroups.forEach(g => {
      const defaultColumn = columns.find(c => c.sort?.group === g && c.sort?.default);
      if (defaultColumn) {
        console.log('add default', g, defaultColumn.key);
        validSorts.push({ ...defaultColumn.sort, key: defaultColumn.key, direction: 'DESCENDING' });
        return;
      }

      const firstColumn = columns.find(c => c.sort?.group === g);
      if (firstColumn) {
        console.log('add first', g, firstColumn.key);
        validSorts.push({ ...firstColumn.sort, key: firstColumn.key, direction: 'DESCENDING' });
      }
    });

    setSorts(validSorts);
  }, [columns, sorts, setSorts]);

  /**
   * This compute the actual sheet columns state.
   */
  React.useEffect(() => {
    const availableSorts = sorts.filter(s => !!columns.find(c => c.key === s.key));

    setColumnStates(
      columns.map(column => {
        // $FlowFixMe: mendo
        let columnState: ColumnState = {
          ...column,
          sort: column.sort
            ? {
                ...column.sort,
                key: column.key,
              }
            : undefined,
        };

        const width = widths.find(cw => cw.key === column.key);
        if (width) {
          columnState = { ...columnState, width: width.width };
        }

        if (column.sort) {
          const sort = availableSorts
            .filter(s => s.group === column.sort?.group)
            .find(s => s.key === column.key);
          if (sort) {
            columnState = {
              ...columnState,
              sort,
            };
          }
        }

        return columnState;
      })
    );
  }, [columns, sorts, widths, setColumnStates]);

  const onColumnResize = React.useCallback(
    (key: string, width: number) => {
      if (widths.find(c => c.key === key)) {
        setWidths(widths.map(c => (c.key === key ? { ...c, width } : c)));
      } else {
        setWidths([...widths, { key, width }]);
      }
    },
    [widths, setWidths]
  );

  const onColumnSortToggle = React.useCallback(
    (key: string) => {
      const column = columns.find(c => c.key === key);
      if (!column || !column.sort) {
        return;
      }

      const previousSort = sorts.find(s => s.key === key);

      setSorts([
        ...sorts.filter(s => s.group !== column.sort?.group),
        {
          ...column.sort,
          key,
          direction: previousSort?.direction === 'DESCENDING' ? 'ASCENDING' : 'DESCENDING',
        },
      ]);
    },
    [columns, sorts, setSorts]
  );

  return (
    <SheetColumnsContext.Provider
      value={{ columns: columnStates, onColumnResize, onColumnSortToggle }}
    >
      {children}
    </SheetColumnsContext.Provider>
  );
};
