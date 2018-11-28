// @flow
import { isEmpty, getByPathWithDefault as get } from 'utils/fp';

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
