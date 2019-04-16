// @flow
import { injectUid } from './id';
import { isNullOrUndefined } from './fp';

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

export function convertVolume(
  volumeMetric: string,
  height: Metric,
  width: Metric,
  length: Metric
): number {
  const heightValue = height.metric === 'cm' ? height.value : height.value * 100;
  const widthValue = width.metric === 'cm' ? width.value : width.value * 100;
  const lengthValue = length.metric === 'cm' ? length.value : length.value * 100;
  const volumeValue = heightValue * widthValue * lengthValue;

  return volumeMetric === 'cm³' ? volumeValue : volumeValue / 1e6;
}

const isBadSizeData = (packageSize: Object): boolean => {
  if (
    packageSize &&
    packageSize.height &&
    packageSize.height.metric &&
    !isNullOrUndefined(packageSize.height.value) &&
    packageSize.width &&
    packageSize.width.metric &&
    !isNullOrUndefined(packageSize.width.value) &&
    packageSize.length &&
    packageSize.length.metric &&
    !isNullOrUndefined(packageSize.length.value)
  ) {
    return false;
  }
  return true;
};

export const calculatePackageVolume = ({ packageVolume, packageSize }: Object): Object =>
  isBadSizeData(packageSize)
    ? {
        metric: packageVolume.metric,
        value: 0,
      }
    : {
        metric: packageVolume.metric,
        value: convertVolume(
          packageVolume.metric,
          packageSize.height,
          packageSize.width,
          packageSize.length
        ),
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
