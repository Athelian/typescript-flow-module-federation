// @flow
import * as React from 'react';
import type { OrderFocusProps } from 'modules/relationMapBeta/order/type.js.flow';
import { ItemWrapperStyle } from 'modules/relationMap/common/RelationItem/style';
import {
  RelationLine,
  // OrderCard,
  // OrderItemCard,
  // BatchCard,
  // TotalCard,
  // WrapperCard,
  // Tags,
  // ShipmentCard,
  // ShipmentCollapsed,
} from 'components/RelationMap';
import Order from './Order';
import TotalItems from './TotalItems';
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
  if (item.orderItems.length === 0)
    return (
      <>
        <Order wrapperClassName={ItemWrapperStyle(false)} {...item} />
        <div />
        <div />
        <div />
        <div />
      </>
    );
  return (
    <>
      <Order wrapperClassName={ItemWrapperStyle(false)} {...item} />
      <RelationLine type={1} />
      <TotalItems
        wrapperClassName={ItemWrapperStyle(false)}
        type="ITEMS"
        total={item.orderItemCount}
        onToggle={console.warn}
      />
      <RelationLine type={1} />
      <TotalItems
        wrapperClassName={ItemWrapperStyle(false)}
        type="BATCHES"
        total={item.batchCount}
        onToggle={console.warn}
      />
    </>
  );
}
