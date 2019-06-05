// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { CONTAINER_ORDER_LIST } from 'modules/permission/constants/container';
import { ORDER_FORM } from 'modules/permission/constants/order';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import { OrderCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import FormattedNumber from 'components/FormattedNumber';
import { SectionHeader, SectionWrapper } from 'components/Form';

import { OrdersSectionWrapperStyle, OrdersSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {
  orders: Array<Object>,
};

function OrdersSection({ orders }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);

  if (!hasPermission(CONTAINER_ORDER_LIST)) return null;

  const canViewOrderForm = hasPermission(ORDER_FORM);

  return (
    <SectionWrapper id="container_ordersSection">
      <SectionHeader
        icon="ORDER"
        title={
          <>
            <FormattedMessage id="modules.container.orders" defaultMessage="ORDERS" /> (
            <FormattedNumber value={orders.length} />)
          </>
        }
      />
      <div className={OrdersSectionWrapperStyle}>
        <SectionNavBar>
          <div id="sortsandfilterswip" />
        </SectionNavBar>

        {orders.length === 0 ? (
          <div className={EmptyMessageStyle}>
            <FormattedMessage
              id="modules.Shipments.noOrderFound"
              defaultMessage="No orders found"
            />
          </div>
        ) : (
          <div className={OrdersSectionBodyStyle}>
            {orders.map(order => (
              <OrderCard
                order={order}
                key={order.id}
                onClick={() => {
                  if (canViewOrderForm) {
                    navigate(`/order/${encodeId(order.id)}`);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export default OrdersSection;
