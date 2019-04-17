// @flow
import { cloneDeep } from 'lodash';
import { totalAdjustQuantity } from 'components/Cards/utils';
import { volumeConvert, weightConvert } from 'utils/metric';
import { getByPath, isNullOrUndefined } from 'utils/fp';

const findBatchQuantity = (batch: Object) => {
  const {
    quantity,
    batchAdjustments,
  }: { quantity: number, batchAdjustments: Array<Object> } = batch;
  return quantity + totalAdjustQuantity(batchAdjustments);
};

const findPriceAmount = (batch: Object, totalBatchQuantity: number) => {
  const {
    orderItem: { price },
  }: { orderItem: { price: Object } } = batch;
  return price.amount * totalBatchQuantity;
};

const findVolume = (batch: Object) => {
  const {
    packageQuantity = 0,
    packageVolume,
  }: {
    packageQuantity: number,
    packageVolume: Object,
  } = batch;
  const volume = isNullOrUndefined(packageVolume)
    ? 0
    : volumeConvert(packageVolume.value, packageVolume.metric, 'm³');
  return packageQuantity * volume;
};

const findWeight = (batch: Object) => {
  const {
    packageQuantity = 0,
    packageGrossWeight = {},
  }: {
    packageQuantity: number,
    packageGrossWeight: Object,
  } = batch;
  return packageGrossWeight
    ? packageQuantity * weightConvert(packageGrossWeight.value, packageGrossWeight.metric, 'kg')
    : 0;
};

export const findSummary = (values: Object) => {
  const { batches = [], totalVolume, totalWeight } = cloneDeep(values);
  let diffCurrency = false;
  let totalBatchQuantity = 0;
  let totalPriceAmount = 0;
  let totalVolumeValue = 0;
  let totalWeightValue = 0;
  let totalBatchPackages = 0;
  const uniqueItems = [];
  const baseCurrency = getByPath('orderItem.price.currency', batches.length > 0 && batches[0]);

  batches.forEach(batch => {
    const { orderItem = {}, packageQuantity = 0 } = batch;
    const { price, id: orderItemId } = orderItem;
    if (!uniqueItems.includes(orderItem && orderItemId)) {
      uniqueItems.push(orderItemId);
    }
    if (baseCurrency !== price.currency) {
      diffCurrency = true;
    }
    const batchQuantity = findBatchQuantity(batch);
    totalBatchQuantity += batchQuantity;
    totalBatchPackages += packageQuantity;
    totalPriceAmount += findPriceAmount(batch, batchQuantity);
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
      ...totalVolume,
      value: totalVolumeValue,
    },
    totalWeight: {
      ...totalWeight,
      value: totalWeightValue,
    },
  };
};

export default findSummary;
