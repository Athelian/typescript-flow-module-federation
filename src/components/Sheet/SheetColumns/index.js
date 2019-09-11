// @flow
import * as React from 'react';

export type SortDirection = 'ASCENDING' | 'DESCENDING';

export type ColumnConfig = {
  key: string,
  title: any,
  icon: string,
  color: string,
  width: number,
  minWidth?: number,
  hidden?: boolean,
  sort?: {
    local: boolean,
    group: string,
    name: string,
    // TODO: handle default sort
    direction?: SortDirection,
  },
};

export type ColumnSort = {
  key: string,
  local: boolean,
  group: string,
  name: string,
  direction: SortDirection,
};

type ColumnWidth = {
  key: string,
  width: number,
};

type Context = {
  columns: Array<ColumnConfig>,
  sorts: Array<ColumnSort>,
  onColumnSortToggle: (key: string) => void,
  onColumnResize: (key: string, width: number) => void,
};

type Props = {
  columns: Array<ColumnConfig>,
  children: React.Node,
};

export const SheetColumnsContext = React.createContext<Context>({
  columns: [],
  sorts: [],
  onColumnSortToggle: () => {},
  onColumnResize: () => {},
});

export const useSheetColumns = (): Context => React.useContext(SheetColumnsContext);

export const SheetColumns = ({ columns, children }: Props) => {
  const [sorts, setSorts] = React.useState<Array<ColumnSort>>([]);
  const [widths, setWidths] = React.useState<Array<ColumnWidth>>([]);
  const [configuredColumns, setConfiguredColumns] = React.useState<Array<ColumnConfig>>([]);

  React.useEffect(() => {
    const latestSorts: Array<ColumnSort> = (Object.values(
      sorts.reduce((first, sort) => {
        if (first[sort.group]) {
          return first;
        }

        return {
          ...first,
          [sort.group]: sort,
        };
      }, {})
    ): any);

    setConfiguredColumns(
      columns.map(column => {
        let configuredColumn = column;

        const width = widths.find(cw => cw.key === column.key);
        if (width) {
          configuredColumn = { ...configuredColumn, width: width.width };
        }

        const sort = latestSorts.find(cs => cs.key === column.key);
        if (sort) {
          configuredColumn = {
            ...configuredColumn,
            sort: {
              ...(configuredColumn.sort || {}),
              direction: sort.direction,
            },
          };
        }

        return configuredColumn;
      })
    );
  }, [columns, sorts, widths, setConfiguredColumns]);

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

      let newSorts = [...sorts];
      const previousSort = sorts.find(c => c.key === key);
      if (previousSort) {
        newSorts = newSorts.filter(c => c.key !== key);
        if (previousSort.direction === 'DESCENDING') {
          newSorts.unshift({ ...column.sort, key, direction: 'ASCENDING' });
        }
      } else {
        newSorts.unshift({ ...column.sort, key, direction: 'DESCENDING' });
      }

      setSorts(newSorts);
    },
    [columns, sorts, setSorts]
  );

  return (
    <SheetColumnsContext.Provider
      value={{ columns: configuredColumns, sorts, onColumnResize, onColumnSortToggle }}
    >
      {children}
    </SheetColumnsContext.Provider>
  );
};
