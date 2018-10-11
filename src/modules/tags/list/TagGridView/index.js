// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { TagCard, CardAction } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

function onClone(tagId: string) {
  navigate(`/tags/clone/${encodeId(tagId)}`);
}

const defaultRenderItem = (item: Object) => (
  <TagCard
    key={item.id}
    tag={item}
    actions={[<CardAction icon="CLONE" hoverColor="BLUE" onClick={() => onClone(item.id)} />]}
    showActionsOnHover
  />
);

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
      emptyMessage={<FormattedMessage id="modules.tags.noItem" defaultMessage="No tags found" />}
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

TagGridView.defaultProps = defaultProps;

export default TagGridView;
