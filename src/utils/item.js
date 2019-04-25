// @flow
import { findBatchQuantity } from 'utils/batch';

type GetItemQuantityChartDataProps = {
  orderItem: {
    quantity: number,
    totalBatched?: number,
    totalShipped?: number,
    batchCount?: number,
    batchShippedCount?: number,
  },
  batches: Array<{
    quantity: number,
    batchAdjustments: Array<{
      quantity: number,
    }>,
    shipment: ?Object,
  }>,
};

export const getItemQuantityChartData = ({ orderItem, batches }: GetItemQuantityChartDataProps) => {
  const orderedQuantity = orderItem.quantity;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let batched = 0;
  let shipped = 0;

  if (batches && batches.length > 0) {
    batches.forEach(({ quantity, batchAdjustments, shipment }) => {
      const currentQuantity = findBatchQuantity({ quantity, batchAdjustments });
      batchedQuantity += currentQuantity;
      batched += 1;
      if (shipment) {
        shippedQuantity += currentQuantity;
        shipped += 1;
      }
    });
  } else {
    batchedQuantity += orderItem.totalBatched;
    shippedQuantity += orderItem.totalShipped;
    batched += orderItem.batchCount;
    shipped += orderItem.batchShippedCount;
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    batched,
    shipped,
  };
};

export default getItemQuantityChartData;
