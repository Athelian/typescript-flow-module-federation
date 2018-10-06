// @flow

export const getShipmentSummary = (shipment: Object) => {
  const totalBatches = shipment.batches.length;
  const shippedBatches = shipment.batches.reduce(
    (total, { orderItem }) =>
      orderItem && orderItem.order && orderItem.order.archived ? total + 1 : total,
    0
  );

  return { totalBatches, shippedBatches, unshippedBatches: totalBatches - shippedBatches };
};

export default getShipmentSummary;
