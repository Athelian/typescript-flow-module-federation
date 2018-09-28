// @flow
import * as React from 'react';
import GridView from 'components/GridView';
import { TagCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <TagCard key={item.id} tag={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const TagGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="200px"
      isEmpty={items.length === 0}
      emptyMessage="No tags found"
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

TagGridView.defaultProps = defaultProps;

export default TagGridView;
