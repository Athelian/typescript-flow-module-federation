// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';
import { GridViewWrapperStyle, EmptyGridViewStyle } from './style';

type OptionalProps = {
  gap?: string,
  isReverse: boolean,
  columnGap: string,
  rowGap: string,
  padding: string,
  loader: React.Node,
};

type Props = OptionalProps & {
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  isEmpty: boolean,
  emptyMessage: any,
  itemWidth: string,
  children: React$Node,
  threshold: number,
};

const defaultProps = {
  loader: <LoadingIcon key="loading" />,
  columnGap: '20px',
  rowGap: '30px',
  isReverse: false,
  padding: '50px 20px',
  threshold: 500,
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
    loader,
    threshold,
  } = props;

  if (isLoading) {
    return <LoadingIcon />;
  }

  if (isEmpty) {
    return (
      <div className={EmptyGridViewStyle}>
        <Display align="center">{emptyMessage}</Display>
      </div>
    );
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
      loader={loader}
      isReverse={isReverse}
      threshold={threshold}
      useWindow={false}
    >
      {children}
    </InfiniteScroll>
  );
}

GridView.defaultProps = defaultProps;

export default GridView;
