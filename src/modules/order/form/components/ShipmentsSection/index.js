// @flow
import * as React from 'react';
import { OrderShipmentCard } from 'components/Cards';
import { EmptyMessageStyle } from 'modules/order/form/components/ItemsSection/style';
import { ItemsSectionWrapperStyle, ItemGridStyle, ItemStyle } from './style';

type Props = {
  shipments: Array<Object>,
};

function ShipmentsSection({ shipments }: Props) {
  return (
    <div className={ItemsSectionWrapperStyle}>
      {shipments.length === 0 ? (
        <div className={EmptyMessageStyle}>No shipments found.</div>
      ) : (
        <div className={ItemGridStyle}>
          {shipments.map(item => (
            <div className={ItemStyle} key={item.id}>
              <OrderShipmentCard shipment={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShipmentsSection;
