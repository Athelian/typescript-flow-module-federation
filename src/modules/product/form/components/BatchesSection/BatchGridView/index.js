// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { BatchCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const OrderGridView = ({ items, onLoadMore, hasMore, isLoading }: Props): React.Node => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      padding="30px 0"
      emptyMessage={
        <FormattedMessage id="modules.Batches.noBatchesFound" defaultMessage="No batches found" />
      }
    >
      {items.map(item => (
        <BatchCard key={item.id} batch={item} />
      ))}
    </GridView>
  );
};

export default OrderGridView;
