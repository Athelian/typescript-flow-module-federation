// @flow
import { totalAdjustQuantity } from 'components/Cards/utils';
import { convert as convertVolume } from 'modules/form/helpers/metricInput/volumeInput';
import { convert as convertWeight } from 'modules/form/helpers/metricInput/weightInput';
import { getByPath } from 'utils/fp';

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
    orderItem: {
      productProvider: { packageVolume = {} },
    },
  }: {
    packageQuantity: number,
    orderItem: {
      productProvider: { packageVolume: Object },
    },
  } = batch;
  const volume = convertVolume(packageVolume.value, packageVolume.metric, 'm³');
  return packageQuantity * volume;
};

const findWeight = (batch: Object) => {
  const {
    orderItem: { productProvider },
    packageQuantity = 0,
  }: {
    packageQuantity: number,
    orderItem: { productProvider: Object },
  } = batch;
  return productProvider.packageGrossWeight
    ? packageQuantity *
        convertWeight(
          productProvider.packageGrossWeight.value,
          productProvider.packageGrossWeight.metric,
          'kg'
        )
    : 0;
};

export const findSummary = (values: Object) => {
  const { batches = [], totalVolume, totalWeight, totalPrice } = values;
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
          ...totalPrice,
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
