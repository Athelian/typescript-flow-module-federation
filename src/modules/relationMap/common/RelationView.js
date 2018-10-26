// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIcon from 'components/LoadingIcon';
import { EmptyMessageStyle, InfiniteScrollWrapperStyle } from '../style';

type OptionalProps = {
  isLoading: boolean,
  spacing: number,
  customRender?: () => React.Node,
  render?: (item: Object) => React.Node,
};

type Props = OptionalProps & {
  isEmpty: boolean,
  emptyMessage: any,
  onLoadMore: Function,
  hasMore: boolean,
  items?: Array<Object>,
  className: string,
};

const defaultProps = {
  isLoading: false,
  spacing: 0,
};

class RelationView extends React.PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const {
      isLoading,
      isEmpty,
      emptyMessage,
      onLoadMore,
      hasMore,
      items,
      render,
      className,
      spacing,
      customRender,
    } = this.props;
    if (isLoading) {
      return <LoadingIcon />;
    }
    if (isEmpty) {
      return <div className={EmptyMessageStyle}>{emptyMessage}</div>;
    }
    return (
      <div className={InfiniteScrollWrapperStyle(spacing)}>
        <InfiniteScroll
          className={className}
          loadMore={onLoadMore}
          hasMore={hasMore}
          loader={<LoadingIcon key="loading" />}
          useWindow={false}
        >
          {customRender && customRender()}
          {!customRender && items && render && items.map((item, index) => render({ item, index }))}
        </InfiniteScroll>
      </div>
    );
  }
}

export default RelationView;
