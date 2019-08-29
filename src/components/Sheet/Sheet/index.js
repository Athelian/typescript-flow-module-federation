// @flow
import * as React from 'react';
import {
  useSheetStateLoadMore,
  useSheetStateInitializer,
  SheetState,
  useSheetState,
  useSheetKeyNavigation,
} from '../SheetState';
import SheetRenderer from '../SheetRenderer';
import CellRenderer from '../CellRenderer';
import type { ColumnConfig } from '../SheetRenderer';
import type { CellValue } from '../SheetState';
import { SheetLiveID } from '../SheetLive';
import { useSheetLiveFocus } from '../SheetLive/focus';
import { useSheetLiveEntity } from '../SheetLive/entity';

type ImplProps = {
  columns: Array<ColumnConfig>,
  items: Array<Object>,
  loading: boolean,
  hasMore: boolean,
  onLoadMore: () => Promise<Array<Object>>,
};

type Props = {
  transformItem: Object => Array<Array<CellValue>>,
  onMutate: ({ entity: Object, field: string, value: any }) => Promise<Array<Object> | null>,
} & ImplProps;

const SheetImpl = ({ columns, items, loading, hasMore, onLoadMore }: ImplProps) => {
  useSheetStateInitializer(columns, items);
  const [loadingMore, handleThreshold] = useSheetStateLoadMore(onLoadMore);
  const { state } = useSheetState();
  useSheetKeyNavigation();
  useSheetLiveFocus();
  useSheetLiveEntity();

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
    <SheetRenderer
      columns={columnsWithWidth}
      rowCount={state.rows.length}
      loading={loading}
      loadingMore={loadingMore}
      focusedAt={state.focusedAt}
      hasMore={hasMore}
      onThreshold={handleThreshold}
      onColumnResize={onColumnResize}
    >
      {CellRenderer}
    </SheetRenderer>
  );
};

const Sheet = ({
  transformItem,
  onMutate,
  columns,
  items,
  loading,
  hasMore,
  onLoadMore,
}: Props) => (
  <SheetState transformItem={transformItem} onMutate={onMutate}>
    <SheetLiveID>
      <SheetImpl
        columns={columns}
        items={items}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />
    </SheetLiveID>
  </SheetState>
);

export default Sheet;
