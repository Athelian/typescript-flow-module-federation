// @flow
import * as React from 'react';
import { ReactHeight } from 'react-height';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIcon from 'components/LoadingIcon';
import { EmptyMessageStyle } from '../style';

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

<<<<<<< HEAD
    if (isEmpty) {
      return <div className={EmptyMessageStyle}>{emptyMessage}</div>;
    }

    const { height } = this.state;
    return (
      <ReactHeight style={{ gridColumn: 'span 3' }} onHeightReady={this.detectHeight()}>
        <div style={{ height, overflow: 'auto' }}>
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
=======
RelationView.defaultProps = defaultProps;
>>>>>>> feat(relation-map): add layout for product view

export default RelationView;
