// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { OrderCard } from 'components/Cards';
import { SectionNavBar } from 'components/NavBar';
import { OrderSectionWrapperStyle, OrderSectionBodyStyle, EmptyMessageStyle } from './style';

type Props = {
  order: ?Object,
};

function OrderSection({ order }: Props) {
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
            <FormattedMessage id="modules.Batches.noOrderFound" defaultMessage="No order found" />
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderSection;
