// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import usePermission from 'hooks/usePermission';
import { type RelatedType, getRelatedConfig } from '../helpers';

type Props = {
  relatedType: RelatedType,
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const RelatedGridView = ({
  relatedType,
  items,
  onLoadMore,
  hasMore,
  isLoading,
}: Props): React.Node => {
  const { hasPermission } = usePermission();

  const { itemWidth, renderItems } = getRelatedConfig(relatedType, hasPermission);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth={itemWidth}
      isEmpty={items.length === 0}
      padding="30px 0"
      emptyMessage={
        <FormattedMessage id="modules.Orders.noOrderFound" defaultMessage="No orders found" />
      }
    >
      {renderItems(items)}
    </GridView>
  );
};

export default RelatedGridView;
