// @flow
import { getBatchLatestQuantity } from 'utils/batch';
import BaseOrderItemCreateAction from 'modules/sheet/order/actions/OrderItemCreateAction';
import BaseBatchesAutofillAction from 'modules/sheet/order/actions/BatchesAutofillAction';
import OrderItemCloneAction from 'modules/sheet/orderItem/actions/OrderItemCloneAction';
import OrderItemDeleteAction from 'modules/sheet/orderItem/actions/OrderItemDeleteAction';
import BaseBatchCreateAction from 'modules/sheet/orderItem/actions/BatchCreateAction';
import BatchCloneAction from 'modules/sheet/batch/actions/BatchCloneAction';
import BaseBatchSyncPackagingAction from 'modules/sheet/batch/actions/BatchSyncPackagingAction';
import BaseBatchSplitAction from 'modules/sheet/batch/actions/BatchSplitAction';
import BaseBatchDeleteRemoveAction from 'modules/sheet/batch/actions/BatchDeleteRemoveAction';

const OrderItemCreateAction = BaseOrderItemCreateAction({
  getCurrency: (orderId, item) => item.currency,
  getImporterId: (orderId, item) => item.importer.id,
  getExporterId: (orderId, item) => item.exporter.id,
});

const BatchesAutofillAction = BaseBatchesAutofillAction({
  getOrderItemsCount: (orderId, item) => item.orderItems.length,
  getNotFullyBatchedOrderItemIds: (orderId, item) =>
    item.orderItems
      .filter(
        oi =>
          oi.quantity >
          oi.batches.reduce((total, batch) => total + getBatchLatestQuantity(batch), 0)
      )
      .map(oi => oi.id),
});

const BatchCreateAction = BaseBatchCreateAction({
  getOrderItemBatchesCount: (orderItemId, item) => {
    const orderItem = item.orderItems.find(oi => oi.id === orderItemId);
    return (orderItem?.batches ?? []).length;
  },
});

const BatchSyncPackagingAction = BaseBatchSyncPackagingAction({
  getProductProviderId: (batchId, item) => {
    const orderItem = (item?.orderItems ?? []).find(oi =>
      (oi?.batches ?? []).some(batch => batch.id === batchId)
    );
    return orderItem?.productProvider?.id;
  },
});

const BatchSplitAction = BaseBatchSplitAction({
  getBatch: (batchId, item) =>
    item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId),
});

const BatchDeleteRemoveAction = BaseBatchDeleteRemoveAction({
  hasShipment: (batchId, item) => {
    const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId);
    return !!batch?.shipment;
  },
  hasContainer: (batchId, item) => {
    const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId);
    return !!batch?.container;
  },
});

export default {
  order_item_create: OrderItemCreateAction,
  order_autofill: BatchesAutofillAction,
  order_item_batch_create: BatchCreateAction,
  order_item_clone: OrderItemCloneAction,
  order_item_delete: OrderItemDeleteAction,
  batch_clone: BatchCloneAction,
  batch_sync_packaging: BatchSyncPackagingAction,
  batch_split: BatchSplitAction,
  batch_delete_remove: BatchDeleteRemoveAction,
};
