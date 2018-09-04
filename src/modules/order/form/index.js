// @flow
import * as React from 'react';
import { Subscribe } from 'unstated';
import { FormattedMessage } from 'react-intl';
import { pickByProps } from 'utils/fp';
import messages from 'modules/order/messages';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import FormattedDate from 'components/FormattedDate';
import Display from 'components/Display';
import OrderFormContainer from './container';
import OrderSection from './components/OrderSection';
import ItemsSection from './components/ItemsSection';
import DocumentsSection from './components/DocumentsSection';
import ShipmentsSection from './components/ShipmentsSection';
import SectionHeader from './components/SectionHeader';
import {
  OrderFormWrapperStyle,
  SectionWrapperStyle,
  LastModifiedWrapperStyle,
  ToggleButtonStyle,
  StatusStyle,
  UserIconStyle,
} from './style';

type Props = {
  order: Object,
};

const orderSectionFields = pickByProps([
  'piNo',
  'poNo',
  'exporter',
  'deliveryPlace',
  'issuedAt',
  'currency',
  'incoterm',
  'totalPrice',
  'batchedQuantity',
  'shippedQuantity',
  'orderItems',
]);
const itemSectionFields = pickByProps(['exporter', 'orderItems']);

export default function OrderForm({ order }: Props) {
  const isNew = Object.keys(order).length === 0;
  const orderValues = orderSectionFields(order);

  return (
    <div className={OrderFormWrapperStyle}>
      <div className={SectionWrapperStyle} id="orderSection">
        <SectionHeader icon="ORDER" title="ORDER">
          {!isNew && (
            <>
              <div className={LastModifiedWrapperStyle}>
                <Display title={<FormattedMessage {...messages.updatedAt} />}>
                  <FormattedDate value={new Date(order.updatedAt)} />
                </Display>
                <div className={UserIconStyle}>
                  <UserAvatar profileUrl="" />
                </div>
              </div>

              <div className={StatusStyle(order.archived)}>
                <Icon icon={order.archived ? 'ARCHIVED' : 'ACTIVE'} />
                {order.archived ? 'Archived' : 'Active'}
                <button
                  type="button"
                  className={ToggleButtonStyle}
                  tabIndex={-1}
                  onClick={() => {}}
                >
                  {order.archived ? <Icon icon="TOGGLE_OFF" /> : <Icon icon="TOGGLE_ON" />}
                </button>
              </div>
            </>
          )}
        </SectionHeader>
        <OrderSection isNew={isNew} initialValues={{ ...orderValues }} />
      </div>
      <div className={SectionWrapperStyle} id="itemsSection">
        <Subscribe to={[OrderFormContainer]}>
          {({ state: values, setFieldValue }) => (
            <>
              <SectionHeader icon="ORDER_ITEM" title={`ITEMS (${values.orderItems.length})`} />
              <ItemsSection
                initialValues={{ ...itemSectionFields(values) }}
                isNew={isNew}
                onSelectItems={orderItems => setFieldValue('orderItems', orderItems)}
              />
            </>
          )}
        </Subscribe>
      </div>
      <div className={SectionWrapperStyle} id="documentsSection">
        <SectionHeader icon="DOCUMENT" title={`DOCUMENTS (${2})`} />
        <DocumentsSection initialValues={{ files: order.files }} />
      </div>
      <div className={SectionWrapperStyle} id="shipmentsSection">
        <SectionHeader icon="SHIPMENT" title={`SHIPMENTS (${20})`} />
        <ShipmentsSection />
      </div>
    </div>
  );
}
