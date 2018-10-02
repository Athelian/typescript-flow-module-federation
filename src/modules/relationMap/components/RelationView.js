// @flow
import * as React from 'react';
import { ReactHeight } from 'react-height';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIcon from 'components/LoadingIcon';
import { EmptyMessageStyle, InfiniteScrollWrapperStyle } from '../style';

type OptionalProps = {
  isLoading: boolean,
};

type Props = OptionalProps & {
  isEmpty: boolean,
  emptyMessage: any,
  onLoadMore: Function,
  hasMore: boolean,
  items: Array<Object>,
  className: string,
  render: (item: Object) => React.Node,
};

type State = {
  height: number,
};

const defaultProps = {
  isLoading: false,
};

class RelationView extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  state = {
    height: 1000,
  };

  detectHeight() {
    return (height: number) => this.setState({ height });
  }

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
    } = this.props;
    if (isLoading) {
      return <LoadingIcon />;
    }

    if (isEmpty) {
      return <div className={EmptyMessageStyle}>{emptyMessage}</div>;
    }

    const { height } = this.state;
    return (
      <ReactHeight style={{ gridColumn: 'span 3' }} onHeightReady={this.detectHeight()}>
        <div className={InfiniteScrollWrapperStyle(hasMore, height)}>
          <InfiniteScroll
            className={className}
            loadMore={onLoadMore}
            hasMore={hasMore}
            loader={<LoadingIcon key="loading" />}
            useWindow={false}
          >
            {items.map((item, index) => render({ item, index }))}
          </InfiniteScroll>
        </div>
      </ReactHeight>
    );
  }
}

export default RelationView;
