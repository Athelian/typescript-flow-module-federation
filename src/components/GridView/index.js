// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import { GridViewWrapperStyle } from './style';

type OptionalProps = {
  gap?: string,
  isReverse: boolean,
  columnGap: string,
  rowGap: string,
  padding: string,
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
  padding: '50px 20px',
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
    padding,
    gap,
    columnGap,
    rowGap,
    children,
  } = props;

  if (isLoading) {
    return <LoadingIcon />;
  }

  if (isEmpty) {
    return <Display>{emptyMessage}</Display>;
  }

  return (
    <InfiniteScroll
      className={`${GridViewWrapperStyle({
        itemWidth,
        columnGap: gap || columnGap,
        rowGap: gap || rowGap,
        padding,
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
