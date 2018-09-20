// @flow
import * as React from 'react';
import { ShipmentOrderCard } from 'components/Cards';
import { ItemsSectionWrapperStyle, ItemGridStyle, ItemStyle, EmptyMessageStyle } from './style';

type Props = {
  orders: Array<Object>,
};

function OrderSection({ orders }: Props) {
  return (
    <div className={ItemsSectionWrapperStyle}>
      {orders.length === 0 ? (
        <div className={EmptyMessageStyle}>No orders found.</div>
      ) : (
        <div className={ItemGridStyle}>
          {orders.map(item => (
            <div className={ItemStyle} key={item.id}>
              <ShipmentOrderCard order={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderSection;
