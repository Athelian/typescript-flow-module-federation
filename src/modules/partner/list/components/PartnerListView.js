// @flow
import * as React from 'react';
import {
  AutoSizer,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';
import ListView from 'components/ListView';
import LoadingIcon from 'components/LoadingIcon';
import PartnerItem from './PartnerItem';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: Function,
};

function PartnerListView({ items, onLoadMore, hasMore, isLoading }: Props) {
  const isRowLoaded = ({ index }) => !hasMore || index < items.length;
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <ListView
          rowHeight={170}
          height={window.innerHeight - 50}
          width={width}
          hasNextPage={hasMore}
          isNextPageLoading={isLoading}
          onLoadNextPage={onLoadMore}
          list={items}
          rowRenderer={({ key, index, style }) =>
            isRowLoaded({ index }) ? (
              <div key={key} style={style}>
                <PartnerItem partner={items[index]} />
              </div>
            ) : (
              <div key={key} style={style}>
                <LoadingIcon />
              </div>
            )
          }
        />
      )}
    </AutoSizer>
  );
}

export default PartnerListView;
