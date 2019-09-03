// @flow
import * as React from 'react';
import type { ColumnConfig } from '../SheetRenderer';

type Context = {
  columns: Array<ColumnConfig>,
  onColumnResize: (key: string, width: number) => void,
};

type Props = {
  columns: Array<ColumnConfig>,
  children: React.Node,
};

export const SheetColumnsContext = React.createContext<Context>({
  columns: [],
  onColumnResize: () => {},
});

export const useSheetColumns = (): Context => React.useContext(SheetColumnsContext);

export const SheetColumns = ({ columns, children }: Props) => {
  const [columnWidths, setColumnWidths] = React.useState<Array<{ width: number, key: string }>>([]);
  const [columnsWithWidth, setColumnsWithWidth] = React.useState<Array<ColumnConfig>>([]);
  const onColumnResize = React.useCallback(
    (key: string, width: number) => {
      if (columnWidths.find(c => c.key === key)) {
        setColumnWidths(columnWidths.map(c => (c.key === key ? { ...c, width } : c)));
      } else {
        setColumnWidths([...columnWidths, { key, width }]);
      }
    },
    [columnWidths, setColumnWidths]
  );

  React.useEffect(() => {
    setColumnsWithWidth(
      columns.map(c => {
        const columnWidth = columnWidths.find(p => p.key === c.key);
        if (columnWidth) {
          return { ...c, width: columnWidth.width };
        }

        return c;
      })
    );
  }, [columns, columnWidths, setColumnsWithWidth]);

  return (
    <SheetColumnsContext.Provider value={{ columns: columnsWithWidth, onColumnResize }}>
      {children}
    </SheetColumnsContext.Provider>
  );
};
