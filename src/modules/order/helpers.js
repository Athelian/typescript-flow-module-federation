// @flow
import { getBatchLatestQuantity } from 'utils/batch';

export const calculateBatchesFromOrder = ({
  batchCount,
  batchShippedCount,
}: {
  batchCount: number,
  batchShippedCount: number,
}) => {
  return {
    totalBatches: batchCount,
    shippedBatches: batchShippedCount,
    unshippedBatches: batchCount - batchShippedCount,
  };
};

export const getQuantityForOrderSummary = (orderItems: Array<Object>) => {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let totalPrice = 0;
  let totalItems = 0;
  let totalBatches = 0;

  if (orderItems) {
    totalItems = orderItems.length;

    orderItems.forEach(item => {
      const qty = item.quantity ? item.quantity : 0;
      const price = item.price ? item.price.amount : 0;
      orderedQuantity += qty;
      totalPrice += price * qty;

      if (item.batches) {
        totalBatches += item.batches.length;
        item.batches.forEach(batch => {
          const latestQuantity = getBatchLatestQuantity(batch);

          batchedQuantity += latestQuantity;
          if (batch.shipment) {
            shippedQuantity += latestQuantity;
          }
        });
      }
    });
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    totalPrice,
    totalItems,
    totalBatches,
  };
};
