// @flow

export const getBatchesSummary = (order: Object) => {
  let totalBatches = 0;
  let shippedBatches = 0;

  if (order.orderItems) {
    order.orderItems.forEach(item => {
      if (item.batches) {
        totalBatches += item.batches.length;
        item.batches.forEach(batch => {
          if (batch.shipment) {
            shippedBatches += 1;
          }
        });
      }
    });
  }

  return { totalBatches, shippedBatches, unshippedBatches: totalBatches - shippedBatches };
};

export default getBatchesSummary;
