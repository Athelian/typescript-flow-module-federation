// @flow
import { isEmpty, getByPathWithDefault as get, uniq } from 'utils/fp';

const getExporterFromOrderItem = orderItem => {
  if (!orderItem) {
    return '';
  }
  const firstId = Object.keys(orderItem)[0];
  const firstItem = orderItem[firstId];
  return get('', 'productProvider.exporter.id', firstItem);
};

const getExporterFromBatch = batch => {
  if (!batch) {
    return '';
  }
  const firstId = Object.keys(batch)[0];
  const firstItem = batch[firstId];
  return get('', 'orderItem.productProvider.exporter.id', firstItem);
};

export const getExportId = (target: Object) => {
  const { orderItem, batch } = target;
  const exportId = getExporterFromOrderItem(orderItem) || getExporterFromBatch(batch);
  return exportId;
};

const isOrderItemSameExporter = (exportId: string, targetItem: Object) => {
  const { orderItem } = targetItem;
  const sameExporter = (Object.entries(orderItem || {}): Array<any>).every(
    item => get('', 'productProvider.exporter.id', item[1]) === exportId
  );
  return sameExporter;
};

const isBatchSameExporter = (exportId: string, targetItem: Object) => {
  const { orderItem, batch } = targetItem;
  const sameExporter = (Object.entries(batch || {}): any)
    .filter(item => {
      const orderItemId = get(false, 'orderItem.id', item[1]) || item[1].parentId;
      return !(orderItem && orderItem[orderItemId]);
    })
    .every(item => get('', 'orderItem.productProvider.exporter.id', item[1]) === exportId);
  return sameExporter;
};

const isDifferentExporter = (exportId: string, targetItem: Object) =>
  !isOrderItemSameExporter(exportId, targetItem) || !isBatchSameExporter(exportId, targetItem);

export const isDisabledMoveToOrder = (targetItem: Object) => {
  const { orderItem, batch } = targetItem;
  const exportId = getExporterFromOrderItem(orderItem) || getExporterFromBatch(batch);
  return isDifferentExporter(exportId, targetItem);
};

export const isDisabledChooseOrder = (order: Object, targetItem: Object) => {
  const exportId = get(null, 'exporter.id', order);
  if (!exportId) {
    return false;
  }
  return isDifferentExporter(exportId, targetItem);
};

export const isSelectSomeItem = (targetedItem: Object) => {
  const { orderItem = {}, batch = {} } = targetedItem;
  const numberOfOrderItem = Object.keys(orderItem).length;
  const numberOfBatch = Object.keys(batch).length;
  const selectSomeItem = numberOfOrderItem > 0 || numberOfBatch > 0;
  return selectSomeItem;
};

export const isDisabledSplit = (targetedItem: Object) => {
  const { orderItem = {}, batch = {} } = targetedItem;
  const numberOfOrderItem = Object.keys(orderItem).length;
  const numberOfBatch = Object.keys(batch).length;
  const selectSomeItem = numberOfOrderItem > 0 || numberOfBatch > 0;
  const selctedOrderItem = numberOfOrderItem === 1 && numberOfBatch === 0;
  const selectedBatch = numberOfBatch === 1 && numberOfOrderItem === 0;
  if (selectSomeItem && (selctedOrderItem || selectedBatch)) {
    return false;
  }
  return true;
};

export const isDisabledMoveToShipment = (targetedItem: Object) => {
  const { batch } = targetedItem;
  const selectedBatch = batch && !isEmpty(batch);
  return !selectedBatch;
};

export const isSelectAllBatch = (targetItem: Object) => {
  const { orderItem, batch = {} } = targetItem;
  if (!orderItem) {
    return true;
  }
  const orderItems: Array<any> = Object.values(orderItem);
  const selectedAllBatchInItem = orderItems.every(item => {
    const selectedAllBatch =
      item.batches && item.batches.every(({ id: batchId }) => batch[batchId]);
    return selectedAllBatch;
  });
  return selectedAllBatchInItem;
};

export const findDiffCurrency = (targetItem: Object, selectedItem: Object) => {
  const { batch = {}, orderItem = {} } = targetItem;
  const { currency } = selectedItem;
  const batches: Array<any> = Object.entries(batch);
  const orderItems: Array<any> = Object.entries(orderItem);
  const filteredItems = orderItems
    .filter(item => {
      const itemCurrency = get('', 'order.currency', item[1]);
      return itemCurrency !== currency;
    })
    .map(item => get('', 'order.currency', item[1]));

  const filteredBatches = batches
    .filter(item => {
      const orderItemId = get('', 'orderItem.id', item[1]);
      const itemCurrency = get('', 'orderItem.order.currency', item[1]);
      return !orderItem[orderItemId] && itemCurrency !== currency;
    })
    .map(item => get('', 'orderItem.order.currency', item[1]));

  const currencies = uniq([...filteredItems, ...filteredBatches]);
  // const diffCurrency = filteredItems.length + filteredBatches.length
  return {
    totalDiff: currencies.length,
    hasDiffCurrency: currencies.length > 0,
    baseCurrency: currency,
    diffCurrency: currencies[0],
  };
};
