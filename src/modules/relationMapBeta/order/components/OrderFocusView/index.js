// @flow
import * as React from 'react';
import type { OrderProps } from 'modules/relationMapBeta/order/type.js.flow';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { actionCreators } from 'modules/relationMapBeta/order/store';
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
import OrderItem from './OrderItem';
import Batch from './Batch';
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
  item: OrderProps,
};

export default function OrderFocusView({ item }: Props) {
  const context = React.useContext(ActionDispatch);
  const { dispatch, state } = context;
  const actions = actionCreators(dispatch);
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
        onToggle={() => actions.toggleExpand('ORDER', item.id)}
      />
      <RelationLine type={1} />
      <TotalItems
        wrapperClassName={ItemWrapperStyle(false)}
        type="BATCHES"
        total={item.batchCount}
        onToggle={() => actions.toggleExpand('ORDER', item.id)}
      />
      {state.expandCards.orders.includes(item.id) &&
        item.orderItems.map(orderItem => (
          <React.Fragment key={orderItem.id}>
            {/* Render order item and first batch if available */}
            <div />
            <RelationLine type={4} />
            <OrderItem wrapperClassName={ItemWrapperStyle(false)} {...orderItem} />
            {orderItem.batches.length > 0 ? (
              <>
                <RelationLine type={1} />
                <Batch wrapperClassName={ItemWrapperStyle(false)} {...orderItem.batches[0]} />
              </>
            ) : (
              <>
                <div /> <div />
              </>
            )}
            {/* render the the remaining batches, from 2nd to end */}
            {orderItem.batches.length > 1 &&
              orderItem.batches.map(
                (batch, index) =>
                  index > 0 && (
                    <React.Fragment key={batch.id}>
                      <div />
                      <RelationLine type={2} />
                      <div />
                      <RelationLine type={4} />
                      <Batch wrapperClassName={ItemWrapperStyle(false)} {...batch} />
                    </React.Fragment>
                  )
              )}
          </React.Fragment>
        ))}
    </>
  );
}
