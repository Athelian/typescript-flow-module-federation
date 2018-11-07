// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';

import { MetadataTemplateCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => (
  <MetadataTemplateCard key={item.id} metadataTemplate={item} />
);

const CustomFieldsTemplateGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="260px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.metadata.noItem" defaultMessage="No template found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

export default CustomFieldsTemplateGridView;
