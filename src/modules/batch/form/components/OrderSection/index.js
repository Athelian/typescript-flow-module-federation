// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Subscribe } from 'unstated';
import { getByPath } from 'utils/fp';
import { OrderCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { SectionHeader, SectionWrapper } from 'components/Form';
import { BatchInfoContainer } from 'modules/batch/form/containers';
import { BATCH_ORDERS_LIST } from 'modules/permission/constants/batch';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';

import { OrderSectionWrapperStyle, OrderSectionBodyStyle, EmptyMessageStyle } from './style';

function OrderSection() {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  if (!hasPermission(BATCH_ORDERS_LIST)) return null;
  return (
    <SectionWrapper id="batch_orderSection">
      <SectionHeader
        icon="ORDER"
        title={<FormattedMessage id="modules.Batches.order" defaultMessage="ORDER" />}
      />
      <Subscribe to={[BatchInfoContainer]}>
        {({ originalValues, state }) => {
          const values = { ...originalValues, ...state };
          const order = getByPath('orderItem.order', values);
          return (
            <div className={OrderSectionWrapperStyle}>
              <SectionNavBar>
                <div id="sortsandfilterswip" />
              </SectionNavBar>
              <div className={OrderSectionBodyStyle}>
                {order ? (
                  <OrderCard order={order} />
                ) : (
                  <div className={EmptyMessageStyle}>
                    <FormattedMessage
                      id="modules.Batches.noOrderFound"
                      defaultMessage="No order found"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Subscribe>
    </SectionWrapper>
  );
}

export default OrderSection;
