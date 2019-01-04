// @flow
const findBatchQuantity = (batch: Object) => {
  const { quantity = 0 } = batch;
  const batchQuantity = batch.batchAdjustments
    ? batch.batchAdjustments.reduce(
        (totalAdjustment, adjustment) => totalAdjustment + adjustment.quantity,
        quantity
      )
    : quantity;
  return batchQuantity;
};

export { findBatchQuantity };
export default findBatchQuantity;
