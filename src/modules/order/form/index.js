// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { pickByProps } from 'utils/fp';
import logger from 'utils/logger';
import orderSectionMesssages from 'modules/order/messages';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import OrderSection from './components/OrderSection';
import ItemSection from './components/ItemSection';
import DocumentSection from './components/DocumentSection';
import ShipmentSection from './components/ShipmentSection';
import SectionHeader from './components/SectionHeader';
import {
  WrapperStyle,
  ToggleButtonStyle,
  UpdatedAtStyle,
  StatusStyle,
  HeaderRightStyle,
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
    <div className={WrapperStyle}>
      <div id="orderSection">
        <SectionHeader icon="ORDER" title="ORDER">
          <div className={HeaderRightStyle}>
            {!isNew && (
              <div className={UpdatedAtStyle}>
                <FormattedMessage {...orderSectionMesssages.updatedAt} />
                <span>
                  <FormattedDate value={new Date(orderValues.updatedAt)} />
                </span>
                <div className={UserIconStyle}>
                  <UserAvatar profileUrl="" />
                </div>
              </div>
            )}
            <div className={StatusStyle(true)}>
              <Icon icon="ACTIVE" />
              {orderValues.status}
            </div>
            <button
              type="button"
              className={ToggleButtonStyle}
              tabIndex={-1}
              onClick={e => logger.warn(e)}
            >
              {orderValues.status === 'Active' ? (
                <Icon icon="TOGGLE_ON" />
              ) : (
                <Icon icon="TOGGLE_OFF" />
              )}
            </button>
          </div>
        </SectionHeader>
        <OrderSection
          id="orderSection"
          isNew={isNew}
          onSubmit={values => logger.warn(values)}
          initialValues={{ ...orderValues }}
        />
      </div>
      <div id="itemSection">
        <SectionHeader icon="CART" title={`ITEMS (${20})`} />
        <ItemSection />
      </div>
      <div id="documentSection">
        <SectionHeader icon="DOCUMENT" title={`DOCUMENTS (${2})`} />
        <DocumentSection initialValues={{ files: order.files }} />
      </div>
      <div id="shipmentSection">
        <SectionHeader icon="SHIPMENT" title={`SHIPMENTS (${20})`} />
        <ShipmentSection />
      </div>
    </div>
  );
}
