// @flow
import { getBatchLatestQuantity } from 'utils/batch';
import { AC } from 'components/Sheet/SheetAction';
import BaseOrderSyncAllPricesAction from 'modules/sheet/order/actions/OrderSyncAllPricesAction';
import OrderExportAction from 'modules/sheet/order/actions/OrderExportAction';
import BaseBatchesAutofillAction from 'modules/sheet/order/actions/BatchesAutofillAction';
import BaseOrderItemCreateAction from 'modules/sheet/order/actions/OrderItemCreateAction';
import OrderItemCloneAction from 'modules/sheet/orderItem/actions/OrderItemCloneAction';
import BaseOrderItemSyncPriceAction from 'modules/sheet/orderItem/actions/OrderItemSyncPriceAction';
import BaseOrderItemAutofillAction from 'modules/sheet/orderItem/actions/OrderItemAutofillAction';
import OrderItemDeleteAction from 'modules/sheet/orderItem/actions/OrderItemDeleteAction';
import BaseBatchCreateAction from 'modules/sheet/orderItem/actions/BatchCreateAction';
import BatchCloneAction from 'modules/sheet/batch/actions/BatchCloneAction';
import BaseBatchSyncPackagingAction from 'modules/sheet/batch/actions/BatchSyncPackagingAction';
import BaseBatchMoveToExistingOrderAction from 'modules/sheet/batch/actions/BatchMoveToExistingOrderAction';
import BaseBatchMoveToNewOrderAction from 'modules/sheet/batch/actions/BatchMoveToNewOrderAction';
import BaseBatchMoveToExistingContainerAction from 'modules/sheet/batch/actions/BatchMoveToExistingContainerAction';
import BaseBatchMoveToExistingShipmentAction from 'modules/sheet/batch/actions/BatchMoveToExistingShipmentAction';
import BaseBatchMoveToNewShipmentAction from 'modules/sheet/batch/actions/BatchMoveToNewShipmentAction';
import BaseBatchMoveToNewContainerOnExistShipmentAction from 'modules/sheet/batch/actions/BatchMoveToNewContainerOnExistShipmentAction';
import BaseBatchSplitAction from 'modules/sheet/batch/actions/BatchSplitAction';
import BaseBatchDeleteRemoveAction from 'modules/sheet/batch/actions/BatchDeleteRemoveAction';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_CREATE,
  ORDER_ITEMS_DELETE,
  ORDER_ITEMS_SET_PRICE,
  ORDER_ITEMS_UPDATE,
} from 'modules/permission/constants/orderItem';
import {
  BATCH_CREATE,
  BATCH_DELETE,
  BATCH_SET_CONTAINER,
  BATCH_SET_PACKAGE_CAPACITY,
  BATCH_SET_PACKAGE_NAME,
  BATCH_SET_PACKAGE_SIZE,
  BATCH_SET_PACKAGE_VOLUME,
  BATCH_SET_PACKAGE_WEIGHT,
  BATCH_SET_SHIPMENT,
  BATCH_UPDATE,
  BATCH_SET_ORDER_ITEM,
} from 'modules/permission/constants/batch';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import {
  SHIPMENT_CREATE,
  SHIPMENT_UPDATE,
  SHIPMENT_ADD_BATCH,
} from 'modules/permission/constants/shipment';
import { PRODUCT_PROVIDER_LIST } from 'modules/permission/constants/product';

const OrderSyncAllPricesAction = BaseOrderSyncAllPricesAction({
  getUniqueProductProvidersIds: item => [
    ...new Set((item?.orderItems ?? []).map(orderItem => orderItem?.productProvider?.id)),
  ],
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
  getProductProviderId: (orderItemId, item) =>
    (item?.orderItems ?? []).find(orderItem => orderItem.id === orderItemId)?.productProvider?.id,
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

const BatchMoveToExistingOrderAction = BaseBatchMoveToExistingOrderAction({
  getCurrency: (batchId, item) => item.currency,
  getOrderId: (batchId, item) => item.id,
  getImporterId: (batchId, item) => item.importer.id,
  getExporterId: (batchId, item) => item.exporter.id,
  getLatestQuantity: (batchId, item) => {
    const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId);
    return getBatchLatestQuantity(batch);
  },
  getProductProviderId: (batchId, item) => {
    const orderItem = (item?.orderItems ?? []).find(oi =>
      (oi?.batches ?? []).some(batch => batch.id === batchId)
    );
    return orderItem?.productProvider?.id;
  },
  getOrderItemNo: (batchId, item) => {
    const orderItem = (item?.orderItems ?? []).find(oi =>
      (oi?.batches ?? []).some(batch => batch.id === batchId)
    );
    return orderItem?.no;
  },
  getOrderItemPrice: (batchId, item) => {
    const orderItem = (item?.orderItems ?? []).find(oi =>
      (oi?.batches ?? []).some(batch => batch.id === batchId)
    );
    return { amount: orderItem?.price?.value, currency: orderItem.price?.metric };
  },
});

const BatchMoveToExistingContainerAction = BaseBatchMoveToExistingContainerAction({
  getContainerId: (batchId, item) => {
    const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId);
    return batch?.container?.id;
  },
  getImporterId: (batchId, item) => {
    const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId);
    return batch?.shipment?.importer?.id;
  },
  getExporterId: (batchId, item) => {
    const batch = item.orderItems.flatMap(oi => oi.batches).find(b => b.id === batchId);
    return batch?.shipment?.exporter?.id;
  },
});

const getBatchData = (batchId: string, item: Object) => {
  const batch = (item?.orderItems ?? [])
    .flatMap(({ batches }) => batches)
    .find(({ id }) => id === batchId);
  return {
    ...batch,
    packageQuantity: batch.packageQuantity?.value,
    packageVolume: batch.packageVolume?.value,
  };
};

const getOrderItemData = (batchId: string, item: Object) => {
  const orderItem = (item?.orderItems ?? []).find(({ batches }) =>
    batches.some(batch => batch.id === batchId)
  );
  return {
    ...orderItem,
    price: {
      amount: orderItem?.price?.value ?? 0,
      currency: orderItem.price?.metric ?? 'USD',
    },
  };
};

const BatchMoveToExistingShipmentAction = BaseBatchMoveToExistingShipmentAction({
  getBatch: getBatchData,
  getImporter: (batchId, item) => item.importer,
  getExporter: (batchId, item) => item.exporter,
});

const BatchMoveToNewOrderAction = BaseBatchMoveToNewOrderAction({
  getContainer: (batchId, item) =>
    (item?.orderItems ?? []).flatMap(({ batches }) => batches).find(({ id }) => id === batchId)
      ?.container,
  getShipment: (batchId, item) =>
    (item?.orderItems ?? []).flatMap(({ batches }) => batches).find(({ id }) => id === batchId)
      ?.shipment,
  getBatch: getBatchData,
  getOrderItem: getOrderItemData,
  getExporter: (batchId, item) => {
    return item.exporter;
  },
});

const BatchMoveToNewContainerOnExsitShipmentAction = BaseBatchMoveToNewContainerOnExistShipmentAction(
  {
    getImporter: (batchId, item) => item.importer,
    getExporter: (batchId, item) => item.exporter,
    getBatch: getBatchData,
    getOrderItem: getOrderItemData,
  }
);

const BatchMoveToNewShipmentAction = BaseBatchMoveToNewShipmentAction({
  getImporter: (batchId, item) => item.importer,
  getExporter: (batchId, item) => item.exporter,
  getBatch: getBatchData,
  getOrderItem: getOrderItemData,
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

    return (orderItem?.quantity ?? 0) > totalBatchQuantity;
  },
});

export default {
  order_export: AC(OrderExportAction),
  order_sync_all_prices: AC(
    OrderSyncAllPricesAction,
    perm => perm(ORDER_ITEMS_UPDATE) || perm(ORDER_ITEMS_SET_PRICE)
  ),
  order_autofill: AC(BatchesAutofillAction, perm => perm(BATCH_CREATE)),
  order_item_create: AC(
    OrderItemCreateAction,
    perm => perm(ORDER_ITEMS_CREATE) && perm(PRODUCT_PROVIDER_LIST)
  ),
  order_item_clone: AC(OrderItemCloneAction, perm => perm(ORDER_ITEMS_CREATE)),
  order_item_sync_price: AC(
    OrderItemSyncPriceAction,
    perm => perm(ORDER_ITEMS_UPDATE) || perm(ORDER_ITEMS_SET_PRICE)
  ),
  order_item_autofill: AC(OrderItemAutofillAction, perm => perm(BATCH_CREATE)),
  order_item_delete: AC(OrderItemDeleteAction, perm => perm(ORDER_ITEMS_DELETE)),
  order_item_batch_create: AC(BatchCreateAction, perm => perm(BATCH_CREATE)),
  batch_clone: AC(BatchCloneAction, perm => perm(BATCH_CREATE)),
  batch_sync_packaging: AC(
    BatchSyncPackagingAction,
    perm =>
      perm(BATCH_UPDATE) ||
      (perm(BATCH_SET_PACKAGE_NAME) &&
        perm(BATCH_SET_PACKAGE_VOLUME) &&
        perm(BATCH_SET_PACKAGE_SIZE) &&
        perm(BATCH_SET_PACKAGE_WEIGHT) &&
        perm(BATCH_SET_PACKAGE_CAPACITY))
  ),
  batch_move_order: AC(
    BatchMoveToExistingOrderAction,
    hasPermissions => hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_ORDER_ITEM)
  ),
  batch_move_new_order: AC(
    BatchMoveToNewOrderAction,
    hasPermissions =>
      hasPermissions(ORDER_CREATE) &&
      (hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_ORDER_ITEM))
  ),
  batch_move_container: AC(
    BatchMoveToExistingContainerAction,
    hasPermissions => hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_CONTAINER)
  ),
  batch_move_new_container: AC(
    BatchMoveToNewContainerOnExsitShipmentAction,
    hasPermissions =>
      hasPermissions(CONTAINER_CREATE) &&
      (hasPermissions(SHIPMENT_UPDATE) || hasPermissions(SHIPMENT_ADD_BATCH)) &&
      (hasPermissions(BATCH_UPDATE) ||
        (hasPermissions(BATCH_SET_SHIPMENT) && hasPermissions(BATCH_SET_CONTAINER)))
  ),
  batch_move_shipment: AC(
    BatchMoveToExistingShipmentAction,
    hasPermissions => hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_SHIPMENT)
  ),
  batch_move_new_shipment: AC(
    BatchMoveToNewShipmentAction,
    hasPermissions =>
      hasPermissions(SHIPMENT_CREATE) &&
      (hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_SHIPMENT))
  ),
  batch_split: AC(BatchSplitAction, perm => perm(BATCH_CREATE)),
  batch_delete_remove: AC(
    BatchDeleteRemoveAction,
    perm =>
      perm(BATCH_DELETE) ||
      perm(BATCH_UPDATE) ||
      perm(BATCH_SET_SHIPMENT) ||
      perm(BATCH_SET_CONTAINER)
  ),
};
