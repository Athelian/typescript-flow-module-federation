// @flow
import * as React from 'react';
import type { BatchPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { navigate } from '@reach/router';
import { encodeId } from 'utils/id';
import { getByPath } from 'utils/fp';
import { OrderCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import ListCardPlaceHolder from 'components/PlaceHolder/ListCardPlaceHolder';
import { SectionHeader, SectionWrapper } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import { SHIPMENT_ORDER_LIST } from 'modules/permission/constants/shipment';
import { ORDER_FORM } from 'modules/permission/constants/order';
import { uniqueOrders } from 'modules/container/utils';
import usePermission from 'hooks/usePermission';
import usePartnerPermission from 'hooks/usePartnerPermission';
import { OrdersSectionWrapperStyle, OrdersSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {|
  isReady: boolean,
  batches: Array<BatchPayload>,
|};

function OrdersSection({ isReady, batches }: Props) {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(SHIPMENT_ORDER_LIST)) return null;

  const orders = uniqueOrders(batches);
  return (
    <SectionWrapper id="shipment_orderSection">
      {!isReady ? (
        <ListCardPlaceHolder />
      ) : (
        <>
          <SectionHeader
            icon="ORDER"
            title={
              <>
                <FormattedMessage id="modules.Shipments.order" defaultMessage="ORDERS" />
                {' ('}
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
                    key={getByPath('id', order)}
                    onClick={() => {
                      if (hasPermission(ORDER_FORM)) {
                        navigate(`/order/${encodeId(getByPath('id', order))}`);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </SectionWrapper>
  );
}

export default OrdersSection;
