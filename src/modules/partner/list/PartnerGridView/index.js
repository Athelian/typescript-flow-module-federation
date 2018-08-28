// @flow
import * as React from 'react';
import GridView from 'components/GridView';
import { PartnerCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <PartnerCard key={item.id} partner={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const PartnerGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth={200}
      isEmpty={items.length === 0}
      emptyMessage="No partners found"
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

PartnerGridView.defaultProps = defaultProps;

export default PartnerGridView;
