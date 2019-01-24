// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { OrderCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { OrdersSectionWrapperStyle, OrdersSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {
  orders: Array<Object>,
};

function OrdersSection({ orders }: Props) {
  return (
    <div className={OrdersSectionWrapperStyle}>
      <SectionNavBar>
        <div id="sortsandfilterswip" />
      </SectionNavBar>
      <div className={OrdersSectionBodyStyle}>
        {orders.length === 0 ? (
          <div className={EmptyMessageStyle}>
            <FormattedMessage
              id="modules.Shipments.noOrderFound"
              defaultMessage="No orders found"
            />
          </div>
        ) : (
          orders.map(order => <OrderCard order={order} key={order.id} />)
        )}
      </div>
    </div>
  );
}

export default OrdersSection;
