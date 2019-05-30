// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { SHIPMENT_ORDER_LIST } from 'modules/permission/constants/shipment';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import FormattedNumber from 'components/FormattedNumber';
import { ShipmentBatchesContainer } from 'modules/shipment/form/containers';
import { SectionWrapper, SectionHeader } from 'components/Form';
import { uniqueOrders } from 'modules/container/utils';
import { OrderCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { OrdersSectionWrapperStyle, OrdersSectionBodyStyle, EmptyMessageStyle } from './style';

function OrdersSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(SHIPMENT_ORDER_LIST)) return null;
  return (
    <SectionWrapper id="shipment_orderSection">
      <Subscribe to={[ShipmentBatchesContainer]}>
        {({ state: { batches } }) => {
          const orders = uniqueOrders(batches);
          return (
            <>
              <SectionHeader
                icon="ORDER"
                title={
                  <>
                    <FormattedMessage id="modules.Shipments.order" defaultMessage="ORDERS" />
                    {' ('}
                    <FormattedNumber value={orders.length} />
                    {')'}
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
                        onClick={() => navigate(`/order/${encodeId(order.id)}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          );
        }}
      </Subscribe>
    </SectionWrapper>
  );
}

export default OrdersSection;
