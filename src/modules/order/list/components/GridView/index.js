// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIcon from 'components/LoadingIcon';
import { GridViewWrapperStyle } from './style';

type Props = {
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  itemWidth: number,
  spacing?: number,
  children: any,
};

const defaultProps = {
  spacing: 30,
};

function GridView(props: Props) {
  const { onLoadMore, hasMore, isLoading, itemWidth, spacing, children } = props;

  if (isLoading) {
    return <LoadingIcon />;
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
