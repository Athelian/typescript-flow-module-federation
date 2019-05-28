// @flow
import { set, cloneDeep } from 'lodash';
import { times, divide } from './number';
import { injectUid } from './id';
import { convertVolume, convertWeight } from './metric';
import { isNullOrUndefined, getByPathWithDefault } from './fp';

export const findWeight = (batch: Object) => {
  const {
    packageQuantity,
    packageGrossWeight,
  }: {
    packageQuantity: number,
    packageGrossWeight: Object,
  } = batch;
  return packageQuantity && packageGrossWeight
    ? times(
        packageQuantity,
        convertWeight(packageGrossWeight.value, packageGrossWeight.metric, 'kg')
      )
    : 0;
};

export const findVolume = (batch: Object) => {
  const {
    packageQuantity,
    packageVolume,
  }: {
    packageQuantity: number,
    packageVolume: Object,
  } = batch;
  return packageQuantity && packageVolume
    ? times(packageQuantity, convertVolume(packageVolume.value, packageVolume.metric, 'm³'))
    : 0;
};

export const getBatchLatestQuantity = ({
  quantity = 0,
  batchQuantityRevisions = [],
}: {
  quantity: number,
  batchQuantityRevisions: Array<{ quantity: number }>,
}): number => {
  return batchQuantityRevisions.length > 0
    ? batchQuantityRevisions[batchQuantityRevisions.length - 1].quantity
    : quantity;
};

export const totalBatchPriceAmount = ({
  quantity = 0,
  batchQuantityRevisions = [],
  orderItem,
}: {
  quantity: number,
  batchQuantityRevisions: Array<{ quantity: number }>,
  orderItem: Object,
}): number => {
  return times(
    getBatchLatestQuantity({ quantity, batchQuantityRevisions }),
    getByPathWithDefault(0, 'price.amount', orderItem)
  );
};

type Metric = {
  value: number,
  metric: string,
};

function calculateVolume(
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

export const calculatePackageQuantity = ({
  quantity = 0,
  batchQuantityRevisions = [],
  packageCapacity = 0,
}: Object) => {
  if (packageCapacity > 0) {
    const validQuantity =
      batchQuantityRevisions.length > 0
        ? batchQuantityRevisions[batchQuantityRevisions.length - 1].quantity
        : quantity;

    return divide(validQuantity, packageCapacity);
  }
  return 0;
};

export const generateCloneBatch = ({
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
    no: `${no} - clone`,
    batchQuantityRevisions: [],
    todo: {
      tasks: [],
    },
  });

export const totalVolume = (total: number, packageQuantity: number, packageVolume: Metric) =>
  !packageVolume || !packageQuantity
    ? total
    : total +
      times(
        packageQuantity,
        packageVolume.metric !== 'cm³' ? packageVolume.value : divide(packageVolume.value, 1000000)
      );

export const findTotalAutoFillBatches = ({
  batches,
  quantity,
}: {
  batches: Array<Object>,
  quantity: number,
}): Object => {
  const totalBatchQuantity = batches.reduce(
    (total, batch) => total + getBatchLatestQuantity(batch),
    0
  );
  return quantity - totalBatchQuantity;
};

export const generateBatchByOrderItem = ({ productProvider }: { productProvider: Object }) => {
  const {
    packageName,
    packageCapacity,
    packageGrossWeight,
    packageVolume,
    packageSize,
  } = productProvider;
  return injectUid({
    tags: [],
    packageName,
    packageCapacity,
    packageGrossWeight,
    packageVolume,
    packageSize,
    quantity: 0,
    packageQuantity: 0,
    isNew: true,
    batchQuantityRevisions: [],
    autoCalculatePackageQuantity: true,
    todo: {
      tasks: [],
      taskTemplate: null,
    },
  });
};

export const updateBatchCardQuantity = (batch: Object, quantity: number): Object => {
  const { batchQuantityRevisions, autoCalculatePackageQuantity } = batch;

  const newBatch = cloneDeep(batch);
  if (batchQuantityRevisions.length > 0) {
    set(
      newBatch,
      `batchQuantityRevisions[${batchQuantityRevisions.length - 1}].quantity`,
      quantity
    );
  } else {
    set(newBatch, `quantity`, quantity);
  }
  if (autoCalculatePackageQuantity) {
    set(newBatch, `packageQuantity`, calculatePackageQuantity(newBatch));
  }
  return newBatch;
};
