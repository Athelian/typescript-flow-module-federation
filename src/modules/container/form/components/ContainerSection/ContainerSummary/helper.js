// @flow
import { cloneDeep } from 'lodash';
import { getBatchLatestQuantity, findVolume, findWeight } from 'utils/batch';
import { getByPath } from 'utils/fp';

const findPriceAmount = (batch: Object, quantity: number) => {
  const {
    orderItem: { price },
  }: { orderItem: { price: Object } } = batch;
  return price.amount * quantity;
};

export const findSummary = (values: Object) => {
  const { batches = [] } = cloneDeep(values);
  let diffCurrency = false;
  let totalBatchQuantity = 0;
  let totalPriceAmount = 0;
  let totalVolumeValue = 0;
  let totalWeightValue = 0;
  let totalBatchPackages = 0;
  const uniqueItems = [];
  const baseCurrency = getByPath('orderItem.price.currency', batches.length > 0 && batches[0]);

  batches.forEach(batch => {
    const { orderItem = {}, packageQuantity = 0, quantity, batchQuantityRevisions } = batch;
    const { price, id: orderItemId } = orderItem;
    if (!uniqueItems.includes(orderItem && orderItemId)) {
      uniqueItems.push(orderItemId);
    }
    if (baseCurrency !== price.currency) {
      diffCurrency = true;
    }
    const latestQuantity = getBatchLatestQuantity({ quantity, batchQuantityRevisions });
    totalBatchQuantity += latestQuantity;
    totalBatchPackages += packageQuantity;
    totalPriceAmount += findPriceAmount(batch, latestQuantity);
    totalVolumeValue += findVolume(batch);
    totalWeightValue += findWeight(batch);
  });
  return {
    totalBatchQuantity,
    totalBatchPackages,
    totalNumberOfUniqueOrderItems: uniqueItems.length,
    totalPrice: diffCurrency
      ? null
      : {
          currency: baseCurrency,
          amount: totalPriceAmount,
        },
    totalVolume: {
      metric: 'm³',
      value: totalVolumeValue,
    },
    totalWeight: {
      metric: 'kg',
      value: totalWeightValue,
    },
  };
};

export default findSummary;
