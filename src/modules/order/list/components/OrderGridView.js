// @flow
import * as React from 'react';
import Measure from 'react-measure';
import GridView from 'components/GridView';
import LoadingIcon from 'components/LoadingIcon';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

function totalColumns(width, columnWidth) {
  return parseInt(width / columnWidth, 10) || 1;
}

class OrderGridView extends React.PureComponent<Props> {
  render() {
    const { items, onLoadMore, hasMore, isLoading } = this.props;
    const isRowLoaded = ({ index }) => !hasMore || index < items.length;
    const columnWidth = 200;
    return (
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <div ref={measureRef}>
            <GridView
              hasNextPage={hasMore}
              isNextPageLoading={isLoading}
              onLoadNextPage={onLoadMore}
              list={items}
              width={contentRect.bounds.width}
              height={window.innerHeight - 50}
              rowCount={
                Math.ceil(items.length / totalColumns(contentRect.bounds.width, columnWidth)) + 1
              }
              rowHeight={170}
              columnWidth={columnWidth}
              columnCount={totalColumns(contentRect.bounds.width, columnWidth)}
              cellRenderer={({ key, columnIndex, rowIndex, style }) => {
                const currentIndex =
                  rowIndex * totalColumns(contentRect.bounds.width, columnWidth) + columnIndex;
                if (isRowLoaded({ index: currentIndex })) {
                  return (
                    <div key={key} style={style}>
                      <OrderItem
                        order={
                          items[
                            rowIndex * totalColumns(contentRect.bounds.width, columnWidth) +
                              columnIndex
                          ]
                        }
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
          </div>
        )}
      </Measure>
    );
  }
}

export default OrderGridView;
