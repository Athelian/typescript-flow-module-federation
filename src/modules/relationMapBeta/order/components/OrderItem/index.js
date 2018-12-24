// @flow
import * as React from 'react';
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
  item: Object,
};

export default function OrderItem({ item }: Props) {
  return <h1>{item.id}</h1>;
}
