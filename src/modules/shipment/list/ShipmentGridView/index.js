// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { ShipmentCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <ShipmentCard key={item.id} shipment={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const ShipmentGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="860px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.shipment.noItem" defaultMessage="No shipments found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

ShipmentGridView.defaultProps = defaultProps;

export default ShipmentGridView;
