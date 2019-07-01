// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { TAG_CREATE } from 'modules/permission/constants/tag';
import usePermission from 'hooks/usePermission';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { TagCard, CardAction } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

function onClone(tagId: string) {
  navigate(`/tags/clone/${encodeId(tagId)}`);
}

const defaultRenderItem = (item: Object, allowCreate: boolean) => (
  <TagCard
    key={item.id}
    tag={item}
    actions={[
      allowCreate ? (
        <CardAction icon="CLONE" hoverColor="BLUE" onClick={() => onClone(item.id)} />
      ) : null,
    ].filter(Boolean)}
    showActionsOnHover
  />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const TagGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props) => {
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(TAG_CREATE);
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={<FormattedMessage id="modules.Tags.noItem" defaultMessage="No tags found" />}
    >
      {items.map(item => renderItem(item, allowCreate))}
    </GridView>
  );
};

TagGridView.defaultProps = defaultProps;

export default TagGridView;
