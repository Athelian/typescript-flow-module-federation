// @flow
import * as React from 'react';
import { SheetColumns, useSheetColumns } from '../SheetColumns';
import type { ColumnConfig, ColumnSort } from '../SheetColumns';
import {
  useSheetStateLoadMore,
  useSheetStateInitializer,
  SheetState,
  useSheetState,
  useSheetKeyNavigation,
} from '../SheetState';
import type { CellValue } from '../SheetState/types';
import { Actions } from '../SheetState/contants';
import SheetRenderer from '../SheetRenderer';
import CellRenderer from '../CellRenderer';
import { SheetLiveID } from '../SheetLive';
import { useSheetLiveFocus } from '../SheetLive/focus';
import { useSheetLiveEntity } from '../SheetLive/entity';
import type { EntityEventHandlerFactory } from '../SheetLive/entity';
import { WrapperStyle } from './style';

type ImplProps = {
  items: Array<Object>,
  loading: boolean,
  hasMore: boolean,
  onLoadMore: () => Promise<Array<Object>>,
  onRemoteSort: (sorts: Array<ColumnSort>) => void,
  handleEntityEvent: ?EntityEventHandlerFactory,
};

type Props = {
  columns: Array<ColumnConfig>,
  onLocalSort: (items: Array<Object>, sorts: Array<ColumnSort>) => Array<Object>,
  transformItem: Object => Array<Array<CellValue>>,
  onMutate: ({ entity: Object, field: string, value: any }) => Promise<Array<Object> | null>,
} & ImplProps;

const SheetImpl = ({
  items,
  loading,
  hasMore,
  onLoadMore,
  onRemoteSort,
  handleEntityEvent,
}: ImplProps) => {
  const { columns, onColumnResize, onColumnSortToggle } = useSheetColumns();
  useSheetStateInitializer(items, onRemoteSort);
  const [loadingMore, handleThreshold] = useSheetStateLoadMore(onLoadMore);
  const { state, dispatch } = useSheetState();
  useSheetKeyNavigation();
  useSheetLiveFocus();
  useSheetLiveEntity(handleEntityEvent);

  const handleMouseLeave = () => {
    dispatch({
      type: Actions.UNHOVER,
    });
  };

  return (
    <div className={WrapperStyle} onMouseLeave={handleMouseLeave}>
      <SheetRenderer
        columns={columns}
        rowCount={state.rows.length}
        loading={loading}
        loadingMore={loadingMore}
        focusAt={state.focusAt}
        hasMore={hasMore}
        onSortToggle={onColumnSortToggle}
        onThreshold={handleThreshold}
        onColumnResize={onColumnResize}
      >
        {CellRenderer}
      </SheetRenderer>
    </div>
  );
};

const Sheet = ({
  transformItem,
  onMutate,
  onLocalSort,
  onRemoteSort,
  columns,
  items,
  loading,
  hasMore,
  onLoadMore,
  handleEntityEvent,
}: Props) => (
  <SheetColumns columns={columns}>
    <SheetState transformItem={transformItem} onMutate={onMutate} onLocalSort={onLocalSort}>
      <SheetLiveID>
        <SheetImpl
          items={items}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          onRemoteSort={onRemoteSort}
          handleEntityEvent={handleEntityEvent}
        />
      </SheetLiveID>
    </SheetState>
  </SheetColumns>
);

export default Sheet;
