// @flow
import { getBatchLatestQuantity } from 'utils/batch';
import BaseBatchesAutofillAction from 'modules/sheet/order/actions/BatchesAutofillAction';
import OrderItemCloneAction from 'modules/sheet/orderItem/actions/OrderItemCloneAction';
import OrderItemDeleteAction from 'modules/sheet/orderItem/actions/OrderItemDeleteAction';
import BaseBatchCreateAction from 'modules/sheet/orderItem/actions/BatchCreateAction';
import BatchCloneAction from 'modules/sheet/batch/actions/BatchCloneAction';
import BaseBatchDeleteRemoveAction from 'modules/sheet/batch/actions/BatchDeleteRemoveAction';

const BatchesAutofillAction = BaseBatchesAutofillAction(
  (orderId, item) => item.orderItems.length,
  (orderId, item) =>
    item.orderItems
      .filter(
        oi =>
          oi.quantity >
          oi.batches.reduce((total, batch) => total + getBatchLatestQuantity(batch), 0)
      )
      .map(oi => oi.id)
);

const BatchCreateAction = BaseBatchCreateAction((orderItemId, item) => {
  const orderItem = item.orderItems.find(oi => oi.id === orderItemId);
  return (orderItem?.batches ?? []).length;
});

const BatchDeleteRemoveAction = BaseBatchDeleteRemoveAction(
  (batchId, item) => {
    const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId);
    return !!batch?.shipment;
  },
  (batchId, item) => {
    const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId);
    return !!batch?.container;
  }
);

export default {
  order_autofill: BatchesAutofillAction,
  order_item_batch_create: BatchCreateAction,
  order_item_clone: OrderItemCloneAction,
  order_item_delete: OrderItemDeleteAction,
  batch_clone: BatchCloneAction,
  batch_delete_remove: BatchDeleteRemoveAction,
};
