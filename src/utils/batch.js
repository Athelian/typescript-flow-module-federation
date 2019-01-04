// @flow
const findBatchQuantity = ({
  quantity = 0,
  batchAdjustments,
}: {
  quantity: number,
  batchAdjustments: Array<{ quantity: number }>,
}) => {
  const batchQuantity = batchAdjustments
    ? batchAdjustments.reduce(
        (totalAdjustment, adjustment) => totalAdjustment + adjustment.quantity,
        quantity
      )
    : quantity;
  return batchQuantity;
};

export { findBatchQuantity };
export default findBatchQuantity;
