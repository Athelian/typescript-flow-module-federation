// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Display } from 'components/Form';
import LoadingIcon from 'components/LoadingIcon';

type OptionalProps = {
  isLoading: boolean,
  id: string,
  className?: string,
  customRender?: () => React.Node,
  render?: (item: Object) => React.Node,
};

type Props = OptionalProps & {
  isEmpty: boolean,
  emptyMessage: any,
  onLoadMore: Function,
  hasMore: boolean,
  items?: Array<Object>,
};

const defaultProps = {
  isLoading: false,
  id: '',
  className: '',
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
      customRender,
      id,
    } = this.props;

    if (isLoading) {
      return <LoadingIcon />;
    }

    if (isEmpty) {
      return <Display align="left">{emptyMessage}</Display>;
    }

    return (
      <InfiniteScroll
        className={className}
        loadMore={onLoadMore}
        hasMore={hasMore}
        loader={<LoadingIcon key="loading" />}
        useWindow={false}
        id={id}
        threshold={500}
      >
        {customRender && customRender()}
        {!customRender && items && render && items.map((item, index) => render({ item, index }))}
      </InfiniteScroll>
    );
  }
}

export default RelationView;
