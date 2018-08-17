// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIcon from 'components/LoadingIcon';
import { GridViewWrapperStyle, EmptyMessageStyle } from './style';

type Props = {
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  isEmpty: boolean,
  emptyMessage: any,
  itemWidth: number,
  spacing?: number,
  children: any,
};

const defaultProps = {
  spacing: 30,
};

function GridView(props: Props) {
  const {
    onLoadMore,
    hasMore,
    isLoading,
    isEmpty,
    emptyMessage,
    itemWidth,
    spacing,
    children,
  } = props;

  if (isLoading) {
    return <LoadingIcon />;
  }

  if (isEmpty) {
    return <div className={EmptyMessageStyle}>{emptyMessage}</div>;
  }

  return (
    <InfiniteScroll
      className={GridViewWrapperStyle(itemWidth, spacing || 30)}
      loadMore={onLoadMore}
      hasMore={hasMore}
      loader={<LoadingIcon key="loading" />}
      threshold={500}
      useWindow={false}
    >
      {children}
    </InfiniteScroll>
  );
}

GridView.defaultProps = defaultProps;

export default GridView;
