// @flow
import * as React from 'react';
import type { OrderFocusProps } from 'modules/relationMapBeta/order/type.js.flow';
import SingleOrder from './SingleOrder';
// import {
//   RelationLine,
//   OrderCard,
//   OrderItemCard,
//   BatchCard,
//   TotalCard,
//   WrapperCard,
//   Tags,
//   ShipmentCard,
//   ShipmentCollapsed,
// } from 'components/RelationMap';
// import {
//   ORDER_ITEM_ALL,
//   BATCH_ALL,
//   ORDER,
//   ORDER_ALL,
//   ORDER_ITEM,
//   BATCH,
//   SHIPMENT,
//   SHIPMENT_ALL,
// } from 'modules/relationMap/constants';

type Props = {
  item: OrderFocusProps,
};

export default function OrderFocusView({ item }: Props) {
  if (item.orderItems.length === 0) return <SingleOrder {...item} />;
  return <h1>{item.id}</h1>;
}
