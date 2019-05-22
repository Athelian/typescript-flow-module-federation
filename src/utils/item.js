// @flow
import { getBatchLatestQuantity } from 'utils/batch';

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
    batchQuantityRevisions: Array<{
      quantity: number,
    }>,
    shipment: ?Object,
  }>,
};

export const getItemQuantityChartData = ({ orderItem, batches }: GetItemQuantityChartDataProps) => {
  const {
    quantity: orderedQuantity = 0,
    totalBatched = 0,
    totalShipped = 0,
    batchCount = 0,
    batchShippedCount = 0,
  } = orderItem;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let batched = 0;
  let shipped = 0;

  if (batches && batches.length > 0) {
    batches.forEach(({ quantity, batchQuantityRevisions, shipment }) => {
      const latestQuantity = getBatchLatestQuantity({ quantity, batchQuantityRevisions });
      batchedQuantity += latestQuantity;
      batched += 1;
      if (shipment) {
        shippedQuantity += latestQuantity;
        shipped += 1;
      }
    });
  } else {
    batchedQuantity += totalBatched;
    shippedQuantity += totalShipped;
    batched += batchCount;
    shipped += batchShippedCount;
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
