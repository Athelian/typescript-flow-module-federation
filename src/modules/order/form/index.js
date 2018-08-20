// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { pickByProps } from 'utils/fp';
import logger from 'utils/logger';
import messages from 'modules/order/messages';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import OrderSection from './components/OrderSection';
import ItemSection from './components/ItemSection';
import DocumentSection from './components/DocumentSection';
import ShipmentSection from './components/ShipmentSection';
import SectionHeader from './components/SectionHeader';
import {
  OrderFormWrapperStyle,
  SectionWrapperStyle,
  LastModifiedWrapperStyle,
  LabelStyle,
  ValueStyle,
  ToggleButtonStyle,
  StatusStyle,
  UserIconStyle,
} from './style';

type Props = {
  order: Object,
};

const orderSectionFields = pickByProps([
  'PI',
  'PO',
  'exporter',
  'status',
  'updatedAt',
  'deliveryPlace',
  'date',
  'currency',
  'incoterms',
  'totalPrice',
  'batchedQuantity',
  'shippedQuantity',
  'items',
]);

export default function OrderForm({ order }: Props) {
  const isNew = Object.keys(order).length === 0;
  logger.warn('order', order);
  const orderValues = orderSectionFields(order);

  return (
    <div className={OrderFormWrapperStyle}>
      <div className={SectionWrapperStyle} id="orderSection">
        <SectionHeader icon="ORDER" title="ORDER">
          {!isNew && (
            <React.Fragment>
              <div className={LastModifiedWrapperStyle}>
                <div className={LabelStyle}>
                  <FormattedMessage {...messages.updatedAt} />
                </div>
                <div className={ValueStyle}>
                  <FormattedDate value={new Date(orderValues.updatedAt)} />
                </div>
                <div className={UserIconStyle}>
                  <UserAvatar profileUrl="" />
                </div>
              </div>

              <div className={StatusStyle(true)}>
                <Icon icon="ACTIVE" />
                {orderValues.status}
                <button
                  type="button"
                  className={ToggleButtonStyle}
                  tabIndex={-1}
                  onClick={() => {}}
                >
                  {orderValues.status === 'Active' ? (
                    <Icon icon="TOGGLE_ON" />
                  ) : (
                    <Icon icon="TOGGLE_OFF" />
                  )}
                </button>
              </div>
            </React.Fragment>
          )}
        </SectionHeader>
        <OrderSection
          id="orderSection"
          isNew={isNew}
          onSubmit={values => logger.warn(values)}
          initialValues={{ ...orderValues }}
        />
      </div>
      <div className={SectionWrapperStyle} id="itemSection">
        <SectionHeader icon="ORDER_ITEM" title={`ITEMS (${20})`} />
        <ItemSection />
      </div>
      <div className={SectionWrapperStyle} id="documentSection">
        <SectionHeader icon="DOCUMENT" title={`DOCUMENTS (${2})`} />
        <DocumentSection initialValues={{ files: order.files }} />
      </div>
      <div className={SectionWrapperStyle} id="shipmentSection">
        <SectionHeader icon="SHIPMENT" title={`SHIPMENTS (${20})`} />
        <ShipmentSection />
      </div>
    </div>
  );
}
