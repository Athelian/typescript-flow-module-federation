// @flow
import * as React from 'react';
import { pickByProps } from 'utils/fp';
import logger from 'utils/logger';
import OrderSection from './components/OrderSection';
import ItemSection from './components/ItemSection';
import DocumentSection from './components/DocumentSection';
import ShipmentSection from './components/ShipmentSection';

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
        <OrderSection
          id="orderSection"
          isNew={isNew}
          onSubmit={values => logger.warn(values)}
          initialValues={{ ...orderSectionFields(order) }}
        />
      </div>
      <div id="itemSection">
        <ItemSection />
      </div>
      <div id="documentSection">
        <DocumentSection />
      </div>
      <div id="shipmentSection">
        <ShipmentSection />
      </div>
    </React.Fragment>
  );
}
