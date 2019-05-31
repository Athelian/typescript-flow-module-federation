// @flow
import { totalVolume, getBatchLatestQuantity } from 'utils/batch';

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
    return totalVolume(total, packageQuantity, packageVolume);
  }, 0);
  return orderTotalVolume;
}

export function calculateShipmentTotalBatchQuantity(shipmentId: string, editData: Object) {
  const allBatches = (Object.entries(editData.batches || {}): Array<any>).filter(
    ([, batch]) => batch.shipment === shipmentId
  );
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return allBatches.length > 0
    ? allBatches
        .map(([, batch]) => batch)
        .map(batch => getBatchLatestQuantity(batch))
        .reduce(reducer)
    : 0;
}

export function calculateShipmentTotalVolume(shipmentId: string, editData: Object) {
  const allBatches = (Object.entries(editData.batches || {}): Array<any>).filter(
    ([, batch]) => batch.shipment === shipmentId
  );

  const shipmentTotalBatchQuantity = allBatches.reduce((total, [, batch]) => {
    const { packageQuantity, packageVolume } = batch;
    return totalVolume(total, packageQuantity, packageVolume);
  }, 0);

  return shipmentTotalBatchQuantity;
}

const totalBatchesPrice = (allBatches: Array<Object>, editData: Object) => {
  const allCurrencies = allBatches.reduce((currencies, [, batch]) => {
    if (batch.orderItem) {
      const orderItem = editData.orderItems[batch.orderItem];

      if (orderItem) {
        const order = editData.orders[orderItem.order];
        return currencies.includes(order.currency) ? currencies : [...currencies, order.currency];
      }
    }

    return currencies;
  }, []);

  if (allCurrencies.length > 1) return { total: -1, allCurrencies };

  const totalPrice = allBatches.reduce((total, [, batch]) => {
    const { quantity } = batch;
    const orderItem = editData.orderItems[batch.orderItem];
    if (orderItem && orderItem.price) {
      return total + quantity * orderItem.price.amount;
    }

    return total;
  }, 0);

  return { total: totalPrice, allCurrencies };
};

export function calculateShipmentTotalPrice(shipmentId: string, editData: Object) {
  const allBatches = (Object.entries(editData.batches || {}): Array<any>).filter(
    ([, batch]) => batch.shipment === shipmentId
  );

  return totalBatchesPrice(allBatches, editData);
}

export function calculateContainerTotalPrice(containerId: string, editData: Object) {
  const allBatches = (Object.entries(editData.batches || {}): Array<any>).filter(
    ([, batch]) => batch.container === containerId
  );

  return totalBatchesPrice(allBatches, editData);
}
