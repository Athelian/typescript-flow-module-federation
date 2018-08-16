// @flow
import * as React from 'react';
import { pickByProps } from 'utils/fp';
import logger from 'utils/logger';
import OrderSection from './components/OrderSection';
import ItemSection from './components/ItemSection';
import DocumentSection from './components/DocumentSection';
import ShipmentSection from './components/ShipmentSection';
import SectionHeader from './components/SectionHeader';

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
]);

export default function OrderForm({ order }: Props) {
  const isNew = Object.keys(order).length === 0;
  logger.warn('order', order);
  return (
    <React.Fragment>
      <div id="orderSection">
        <SectionHeader icon="ORDER" title="ORDER">
          <div>
            Status
            {/* {!isNew && (
              <React.Fragment>
                <p>Last Modified: {initialValues.updatedAt}</p>
                <UserAvatar profileUrl="" />
              </React.Fragment>
            )}
            <p>Status: {initialValues.status} </p> */}
          </div>
        </SectionHeader>
        <OrderSection
          id="orderSection"
          isNew={isNew}
          onSubmit={values => logger.warn(values)}
          initialValues={{ ...orderSectionFields(order) }}
        />
      </div>
      <div id="itemSection">
        <SectionHeader icon="CART" title={`ITEMS (${20})`} />
        <ItemSection />
      </div>
      <div id="documentSection">
        <SectionHeader icon="DOCUMENT" title={`DOCUMENTS (${2})`} />
        <DocumentSection />
      </div>
      <div id="shipmentSection">
        <SectionHeader icon="SHIPMENT" title={`SHIPMENTS (${20})`} />
        <ShipmentSection />
      </div>
    </React.Fragment>
  );
}
