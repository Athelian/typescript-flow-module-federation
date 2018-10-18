// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIcon from 'components/LoadingIcon';
import { GridViewWrapperStyle, EmptyMessageStyle } from './style';

type OptionalProps = {
  gap?: string,
  isReverse: boolean,
  columnGap: string,
  rowGap: string,
};

type Props = OptionalProps & {
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  isEmpty: boolean,
  emptyMessage: any,
  itemWidth: string,
  children: any,
};

const defaultProps = {
  columnGap: '20px',
  rowGap: '30px',
  isReverse: false,
};

function GridView(props: Props) {
  const {
    onLoadMore,
    hasMore,
    isLoading,
    isEmpty,
    emptyMessage,
    itemWidth,
    isReverse,
    gap,
    columnGap,
    rowGap,
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
      className={`${GridViewWrapperStyle({
        itemWidth,
        columnGap: gap || columnGap,
        rowGap: gap || rowGap,
      })} InfiniteScroll`}
      loadMore={onLoadMore}
      hasMore={hasMore}
      loader={<LoadingIcon key="loading" />}
      isReverse={isReverse}
      threshold={500}
      useWindow={false}
    >
      {children}
    </InfiniteScroll>
  );
}

GridView.defaultProps = defaultProps;

export default GridView;
