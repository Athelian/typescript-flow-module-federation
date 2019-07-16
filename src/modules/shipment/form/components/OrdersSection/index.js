// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { getByPathWithDefault } from 'utils/fp';
import QueryPlaceHolder from 'components/PlaceHolder/QueryPlaceHolder';
import { OrderCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import { SectionHeader } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { SHIPMENT_ORDER_LIST } from 'modules/permission/constants/shipment';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { uniqueOrders } from 'modules/container/utils';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { shipmentFormOrderQuery } from './query';
import { OrdersSectionWrapperStyle, OrdersSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {|
  entityId: string,
  isLoading: boolean,
|};

function OrdersSection({ entityId, isLoading }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(SHIPMENT_ORDER_LIST)) return null;

  return (
    <QueryPlaceHolder
      PlaceHolder={ListCardPlaceHolder}
      query={shipmentFormOrderQuery}
      entityId={entityId}
      isLoading={isLoading}
    >
      {({ data }) => {
        const orders = uniqueOrders(getByPathWithDefault([], 'shipment.batches', data));
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
                      onClick={() => {
                        if (hasPermission(ORDER_FORM)) {
                          navigate(`/order/${encodeId(order.id)}`);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        );
      }}
    </QueryPlaceHolder>
  );
}

export default OrdersSection;
