// @flow
import { getBatchLatestQuantity } from 'utils/batch';
import BaseOrderSyncAllPricesAction from 'modules/sheet/order/actions/OrderSyncAllPricesAction';
import BaseBatchesAutofillAction from 'modules/sheet/order/actions/BatchesAutofillAction';
import BaseOrderItemCreateAction from 'modules/sheet/order/actions/OrderItemCreateAction';
import OrderItemCloneAction from 'modules/sheet/orderItem/actions/OrderItemCloneAction';
import BaseOrderItemSyncPriceAction from 'modules/sheet/orderItem/actions/OrderItemSyncPriceAction';
import BaseOrderItemAutofillAction from 'modules/sheet/orderItem/actions/OrderItemAutofillAction';
import OrderItemDeleteAction from 'modules/sheet/orderItem/actions/OrderItemDeleteAction';
import BaseBatchCreateAction from 'modules/sheet/orderItem/actions/BatchCreateAction';
import BatchCloneAction from 'modules/sheet/batch/actions/BatchCloneAction';
import BaseBatchSyncPackagingAction from 'modules/sheet/batch/actions/BatchSyncPackagingAction';
import BaseBatchSplitAction from 'modules/sheet/batch/actions/BatchSplitAction';
import BaseBatchDeleteRemoveAction from 'modules/sheet/batch/actions/BatchDeleteRemoveAction';

const OrderSyncAllPricesAction = BaseOrderSyncAllPricesAction({
  getUniqueProductProvidersIds: item => {
    const uniqueProductProviderIds = [
      ...new Set((item?.orderItems ?? []).map(orderItem => orderItem?.productProvider?.id)),
    ];

    return uniqueProductProviderIds;
  },
  getOrderItemsProductProvidersMapping: (item, productProviders) => {
    let numOfOrderItemsAbleToSync = 0;

    const orderItemsMapping = (item?.orderItems ?? []).map(orderItem => {
      const matchedProductProvider = productProviders.find(
        productProvider => productProvider.id === orderItem?.productProvider?.id
      );

      const currencyMatches = matchedProductProvider?.unitPrice?.currency === item?.currency;
      if (currencyMatches) {
        numOfOrderItemsAbleToSync += 1;
      }

      return {
        ...orderItem,
        productProvider: {
          ...matchedProductProvider,
        },
        currencyMatches,
      };
    });

    return { orderItemsMapping, numOfOrderItemsAbleToSync };
  },
});

const OrderItemCreateAction = BaseOrderItemCreateAction({
  getCurrency: (orderId, item) => item.currency,
  getImporterId: (orderId, item) => item.importer.id,
  getExporterId: (orderId, item) => item.exporter.id,
});

const OrderItemSyncPriceAction = BaseOrderItemSyncPriceAction({
  getProductProviderId: (orderItemId, item) => {
    const productProviderId = (item?.orderItems ?? []).find(
      orderItem => orderItem.id === orderItemId
    )?.productProvider?.id;

    return productProviderId;
  },
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

const OrderItemAutofillAction = BaseOrderItemAutofillAction({
  getAutofillable: (orderItemId, item) => {
    const orderItem = item.orderItems.find(oi => oi.id === orderItemId);

    const totalBatchQuantity = (orderItem?.batches ?? []).reduce((total, batch) => {
      return total + getBatchLatestQuantity(batch);
    }, 0);
    const autofillable = (orderItem?.quantity ?? 0) > totalBatchQuantity;

    return autofillable;
  },
});

export default {
  order_sync_all_prices: OrderSyncAllPricesAction,
  order_autofill: BatchesAutofillAction,
  order_item_create: OrderItemCreateAction,
  order_item_clone: OrderItemCloneAction,
  order_item_sync_price: OrderItemSyncPriceAction,
  order_item_autofill: OrderItemAutofillAction,
  order_item_delete: OrderItemDeleteAction,
  order_item_batch_create: BatchCreateAction,
  batch_clone: BatchCloneAction,
  batch_sync_packaging: BatchSyncPackagingAction,
  batch_split: BatchSplitAction,
  batch_delete_remove: BatchDeleteRemoveAction,
};
