// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => (
  <TemplateCard
    key={item.id}
    template={{
      id: item.id,
      title: item.name,
      description: item.memo,
      count: (item.fieldDefinitions || []).length,
    }}
    type="METADATA"
  />
);

const MaskGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props) => (
  <GridView
    onLoadMore={onLoadMore}
    hasMore={hasMore}
    isLoading={isLoading}
    itemWidth="195px"
    isEmpty={items.length === 0}
    emptyMessage={
      <FormattedMessage id="modules.metadata.noItem" defaultMessage="No template found" />
    }
  >
    {items.map(item => renderItem(item))}
  </GridView>
);

export default MaskGridView;
