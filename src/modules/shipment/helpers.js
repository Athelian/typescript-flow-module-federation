// @flow

export const getShipmentSummary = (shipment: Object) => {
  const totalBatches = shipment.batches ? shipment.batches.length : 0;
  const batchesOfActiveOrder = shipment.batches.reduce(
    (total, { orderItem }) =>
      orderItem && orderItem.order && orderItem.order.archived ? total : total + 1,
    0
  );

  return {
    totalBatches,
    batchesOfActiveOrder,
    batchesOfArchivedOrder: totalBatches - batchesOfActiveOrder,
  };
};

export default getShipmentSummary;
