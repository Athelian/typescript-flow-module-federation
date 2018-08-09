// @flow
import * as React from 'react';
import {
  AutoSizer,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';
import ListView from 'components/ListView';
import LoadingIcon from 'components/LoadingIcon';
import WarehouseItem from './WarehouseItem';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: Function,
};

function WarehouseListView({ items, onLoadMore, hasMore, isLoading }: Props) {
  const isRowLoaded = ({ index }) => !hasMore || index < items.length;
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <ListView
          rowHeight={170}
          height={window.innerHeight - 50}
          width={width}
          hasNextPage={hasMore}
          isNextPageLoading={isLoading}
          onLoadNextPage={onLoadMore}
          list={items}
          rowRenderer={({ key, index, style }) =>
            isRowLoaded({ index }) ? (
              <div key={key} style={style}>
                <WarehouseItem warehouse={items[index]} />
              </div>
            ) : (
              <div key={key} style={style}>
                <LoadingIcon />
              </div>
            )
          }
        />
      )}
    </AutoSizer>
  );
}

export default WarehouseListView;
