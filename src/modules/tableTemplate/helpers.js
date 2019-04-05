// @flow
import { calculateBatchQuantity } from 'utils/batch';

export const mapColumnId: Function = (entity: string) => (_: any, index: number): string =>
  `${entity}-${index}`;

export function calculateOrderTotalVolume(orderItems: Array<string>, editData: Object) {
  const allBatchIds = [];
  orderItems.forEach(orderItemId => {
    const { batches = [] } = editData.orderItems[orderItemId] || {};
    batches.forEach(id => {
      if (!allBatchIds.includes(id)) allBatchIds.push(id);
    });
  });
  const orderTotalVolume = allBatchIds.reduce((total, batchId) => {
    const { packageQuantity, packageVolume } = editData.batches[batchId] || {};
    if (!packageVolume || !packageQuantity) return total;
    return (
      total +
      packageQuantity *
        (packageVolume.metric !== 'cm³' ? packageVolume.value : packageVolume.value / 1e6)
    );
  }, 0);
  return orderTotalVolume;
}

export function calculateShipmentTotalBatchQuantity(shipmentId: string, editData: Object) {
  const allBatches = (Object.entries(editData.batches || {}): Array<any>).filter(
    ([, batch]) => batch.shipment === shipmentId
  );
  return calculateBatchQuantity(allBatches.map(([, batch]) => batch));
}

export function calculateShipmentTotalVolume(shipmentId: string, editData: Object) {
  const allBatches = (Object.entries(editData.batches || {}): Array<any>).filter(
    ([, batch]) => batch.shipment === shipmentId
  );

  const shipmentTotalBatchQuantity = allBatches.reduce((total, [, batch]) => {
    const { packageQuantity, packageVolume } = batch;
    if (!packageVolume || !packageQuantity) return total;

    return (
      total +
      packageQuantity *
        (packageVolume.metric !== 'cm³' ? packageVolume.value : packageVolume.value / 1e6)
    );
  }, 0);

  return shipmentTotalBatchQuantity;
}

export function calculateShipmentTotalPrice(shipmentId: string, editData: Object) {
  const allBatches = (Object.entries(editData.batches || {}): Array<any>).filter(
    ([, batch]) => batch.shipment === shipmentId
  );

  const allCurrencies = allBatches.reduce((currencies, [, batch]) => {
    const { id: batchId } = batch;
    const [, orderItem] =
      (Object.entries(editData.orderItems || {}): Array<any>).find(([, currentOrderItem]) =>
        currentOrderItem.batches.includes(batchId)
      ) || [];

    const [, order] =
      (Object.entries(editData.orders || {}): Array<any>).find(([, currentOrder]) =>
        currentOrder.orderItems.includes(orderItem.id)
      ) || [];

    return currencies.includes(order.currency) ? currencies : [...currencies, order.currency];
  }, []);

  if (allCurrencies.length > 1) return { total: -1, allCurrencies };

  const shipmentTotalPrice = allBatches.reduce((total, [, batch]) => {
    const { quantity, id: batchId } = batch;
    const [, orderItem] =
      (Object.entries(editData.orderItems || {}): Array<any>).find(([, currentOrderItem]) =>
        currentOrderItem.batches.includes(batchId)
      ) || [];

    return total + quantity * orderItem.price.amount;
  }, 0);

  return { total: shipmentTotalPrice, allCurrencies };
}
