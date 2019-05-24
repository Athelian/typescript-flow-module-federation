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
};

const ShipmentGridView = ({ items, onLoadMore, hasMore, isLoading }: Props): React.Node => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="860px"
      isEmpty={items.length === 0}
      padding="30px 0"
      emptyMessage={
        <FormattedMessage
          id="modules.Shipments.noShipmentFound"
          defaultMessage="No shipments found"
        />
      }
    >
      {items.map(item => (
        <ShipmentCard key={item.id} shipment={item} />
      ))}
    </GridView>
  );
};

export default ShipmentGridView;
