// @flow
import React from 'react';
import { ShipmentWrapperStyle } from 'modules/relationMap/style';

type Props = {
  orders: Array<Object>,
  selectedOrder: string,
  render: Function,
};
const ShipmentList = ({ orders, selectedOrder, render }: Props) => {
  // TODO(after done layout): remove false condition
  let shipments;
  if (!selectedOrder) {
    shipments = orders.map(order => order.shipments.map(shipment => render({ shipment })));
    return <div className={ShipmentWrapperStyle}>{shipments}</div>;
  }
  // TODO(after done layout): enable filter
  // const filteredOrder = orders.filter(order => order.id === selectedOrder)[0];
  const filteredOrder = orders[0];
  shipments = filteredOrder.shipments.map(shipment => render({ shipment }));
  return <div className={ShipmentWrapperStyle}>{shipments}</div>;
};

export default ShipmentList;
