// @flow
import * as React from 'react';
/* $FlowFixMe: not have flow type yet */
import { InfiniteLoader, List } from 'react-virtualized';

type RenderItemProps = {
  key: number,
  index: number,
  style: Object,
};

type Props = {
  loaderOptions: {
    isRowLoaded: Function,
    loadMoreRows?: Function,
    rowCount: number,
  },
  type: 'list' | 'grid',
  total: number,
  listOptions?: {
    height: number,
    width: number,
    rowHeight: number,
  },
  renderItem: (item: RenderItemProps) => React.Node,
};

export default class InfiniteLoaderWrapper extends React.PureComponent<Props> {
  static defaultProps = {
    listOptions: {},
  };

  render() {
    const { loaderOptions, listOptions, total, renderItem } = this.props;
    return (
      <InfiniteLoader {...loaderOptions}>
        {({ onRowsRendered, registerChild }) => (
          <List
            {...listOptions}
            onRowsRendered={onRowsRendered}
            ref={registerChild}
            rowCount={total}
            rowRenderer={renderItem}
          />
        )}
      </InfiniteLoader>
    );
  }
}
