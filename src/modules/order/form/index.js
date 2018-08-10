// @flow
import * as React from 'react';
import OrderSection from './components/OrderSection';
import ItemSection from './components/ItemSection';
import DocumentSection from './components/DocumentSection';
import ShipmentSection from './components/ShipmentSection';

type Props = {
  order: Object,
};

export default function OrderForm({ order }: Props) {
  return (
    <React.Fragment>
      <div id="orderSection">
        <OrderSection />
        {JSON.stringify(order)}{' '}
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
