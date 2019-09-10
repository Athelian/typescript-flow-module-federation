// @flow
import * as React from 'react';
import { SheetColumns, useSheetColumns } from '../SheetColumns';
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
import type { ColumnConfig } from '../SheetRenderer';
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
  handleEntityEvent: ?EntityEventHandlerFactory,
};

type Props = {
  columns: Array<ColumnConfig>,
  transformItem: Object => Array<Array<CellValue>>,
  onMutate: ({ entity: Object, field: string, value: any }) => Promise<Array<Object> | null>,
} & ImplProps;

const SheetImpl = ({ items, loading, hasMore, onLoadMore, handleEntityEvent }: ImplProps) => {
  const { columns, onColumnResize } = useSheetColumns();
  useSheetStateInitializer(columns, items);
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
  columns,
  items,
  loading,
  hasMore,
  onLoadMore,
  handleEntityEvent,
}: Props) => (
  <SheetColumns columns={columns}>
    <SheetState transformItem={transformItem} onMutate={onMutate}>
      <SheetLiveID>
        <SheetImpl
          items={items}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          handleEntityEvent={handleEntityEvent}
        />
      </SheetLiveID>
    </SheetState>
  </SheetColumns>
);

export default Sheet;
