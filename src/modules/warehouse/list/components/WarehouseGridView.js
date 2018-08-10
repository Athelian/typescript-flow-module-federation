// @flow
import * as React from 'react';
import {
  AutoSizer,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';
import GridView from 'components/GridView';
import LoadingIcon from 'components/LoadingIcon';
import WarehouseItem from './WarehouseItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

function totalColumns(width, columnWidth) {
  return parseInt(width / columnWidth, 10) || 1;
}

function WarehouseGridView({ items, onLoadMore, isLoading, hasMore }: Props) {
  const isRowLoaded = ({ index }) => !hasMore || index < items.length;
  const columnWidth = 200;
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <GridView
          hasNextPage={hasMore}
          isNextPageLoading={isLoading}
          onLoadNextPage={onLoadMore}
          list={items}
          width={width}
          height={window.innerHeight - 50}
          rowCount={Math.ceil(items.length / totalColumns(width, columnWidth)) + 1}
          rowHeight={170}
          columnWidth={columnWidth}
          columnCount={totalColumns(width, columnWidth)}
          cellRenderer={({ key, columnIndex, rowIndex, style }) => {
            const currentIndex = rowIndex * totalColumns(width, columnWidth) + columnIndex;
            if (isRowLoaded({ index: currentIndex })) {
              return (
                <div key={key} style={style}>
                  <WarehouseItem
                    warehouse={items[rowIndex * totalColumns(width, columnWidth) + columnIndex]}
                    key={key}
                  />
                </div>
              );
            }

            if (currentIndex === items.length)
              return (
                <div key={key} style={style}>
                  <LoadingIcon />
                </div>
              );

            return <div key={key} style={style} />;
          }}
        />
      )}
    </AutoSizer>
  );
}

export default WarehouseGridView;
