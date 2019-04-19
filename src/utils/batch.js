// @flow
import { times, divide } from 'number-precision';
import { injectUid } from './id';
import { convertVolume, convertWeight } from './metric';
import { isNullOrUndefined } from './fp';

export const findWeight = (batch: Object) => {
  const {
    packageQuantity = 0,
    packageGrossWeight = {},
  }: {
    packageQuantity: number,
    packageGrossWeight: Object,
  } = batch;
  return packageGrossWeight
    ? packageQuantity * convertVolume(packageGrossWeight.value, packageGrossWeight.metric, 'kg')
    : 0;
};

export const findVolume = (batch: Object) => {
  const {
    packageQuantity = 0,
    packageVolume,
  }: {
    packageQuantity: number,
    packageVolume: Object,
  } = batch;
  const volume = isNullOrUndefined(packageVolume)
    ? 0
    : convertWeight(packageVolume.value, packageVolume.metric, 'm³');
  return packageQuantity * volume;
};

export const findBatchQuantity = ({
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

type Metric = {
  value: number,
  metric: string,
};

export function calculateVolume(
  volumeMetric: string,
  height: Metric,
  width: Metric,
  length: Metric
): number {
  const heightValue = height.metric === 'cm' ? height.value : times(height.value, 100);
  const widthValue = width.metric === 'cm' ? width.value : times(width.value, 100);
  const lengthValue = length.metric === 'cm' ? length.value : times(length.value, 100);
  const volumeValue = times(heightValue, widthValue, lengthValue);

  return volumeMetric === 'cm³' ? volumeValue : divide(volumeValue, 1000000);
}

const isBadMetricData = (data: Object): boolean =>
  isNullOrUndefined(data.metric) || isNullOrUndefined(data.value);

export const calculatePackageVolume = ({ packageVolume, packageSize }: Object): Object => {
  if (
    isNullOrUndefined(packageVolume) ||
    isBadMetricData(packageVolume) ||
    isNullOrUndefined(packageSize) ||
    isNullOrUndefined(packageSize.height) ||
    isBadMetricData(packageSize.height) ||
    isNullOrUndefined(packageSize.width) ||
    isBadMetricData(packageSize.width) ||
    isNullOrUndefined(packageSize.length) ||
    isBadMetricData(packageSize.length)
  ) {
    return packageVolume;
  }
  return {
    metric: packageVolume.metric,
    value: calculateVolume(
      packageVolume.metric,
      packageSize.height,
      packageSize.width,
      packageSize.length
    ),
  };
};

export const calculateUnitVolume = ({ unitVolume, unitSize }: Object): Object => {
  if (
    isNullOrUndefined(unitVolume) ||
    isBadMetricData(unitVolume) ||
    isNullOrUndefined(unitSize) ||
    isNullOrUndefined(unitSize.height) ||
    isBadMetricData(unitSize.height) ||
    isNullOrUndefined(unitSize.width) ||
    isBadMetricData(unitSize.width) ||
    isNullOrUndefined(unitSize.length) ||
    isBadMetricData(unitSize.length)
  ) {
    return unitVolume;
  }
  return {
    metric: unitVolume.metric,
    value: calculateVolume(unitVolume.metric, unitSize.height, unitSize.width, unitSize.length),
  };
};

export function calculateBatchQuantity(batches: Array<Object>): number {
  let total = 0;
  batches.forEach(batch => {
    total += batch.quantity;
    if (batch.batchAdjustments) {
      batch.batchAdjustments.forEach(({ quantity }) => {
        total += quantity;
      });
    }
  });
  return total;
}

export const calculatePackageQuantity = ({
  packageCapacity = 0,
  quantity,
  batchAdjustments,
}: Object) => {
  if (packageCapacity > 0) {
    const totalQuantity = batchAdjustments.reduce(
      (total, adjustment) => adjustment.quantity + total,
      quantity
    );
    return totalQuantity > 0 ? totalQuantity / packageCapacity : 0;
  }
  return 0;
};

export const generateBatchForClone = ({
  id,
  deliveredAt,
  desired,
  expiredAt,
  producedAt,
  no,
  ...rest
}: Object) =>
  injectUid({
    ...rest,
    isNew: true,
    no: `${no}- clone`,
    batchAdjustments: [],
    todo: {
      tasks: [],
    },
  });

export const generateBatchByOrderItem = (orderItem: Object) => {
  const {
    productProvider: {
      packageName,
      packageCapacity,
      packageGrossWeight,
      packageVolume,
      packageSize,
    },
  } = orderItem;
  return injectUid({
    isNew: true,
    orderItem,
    tags: [],
    packageName,
    packageCapacity,
    packageGrossWeight,
    packageVolume,
    packageSize,
    quantity: 0,
    batchAdjustments: [],
    autoCalculatePackageQuantity: true,
    todo: {
      tasks: [],
    },
  });
};

export const totalVolume = (total: number, packageQuantity: number, packageVolume: Metric) =>
  !packageVolume || !packageQuantity
    ? total
    : total +
      times(
        packageQuantity,
        packageVolume.metric !== 'cm³' ? packageVolume.value : divide(packageVolume.value, 1000000)
      );
