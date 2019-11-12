// @flow
import { set, cloneDeep } from 'lodash';
import type {
  MetricValue,
  Size,
  Batch,
  BatchPayload,
  OrderItemPayload,
  BatchQuantityRevision,
} from 'generated/graphql';
import {
  BATCH_UPDATE,
  BATCH_SET_CUSTOM_FIELDS,
  BATCH_SET_CUSTOM_FIELDS_MASK,
  BATCH_SET_TAGS,
} from 'modules/permission/constants/batch';
import { times, divide } from './number';
import { uuid } from './id';
import {
  defaultDistanceMetric,
  defaultVolumeMetric,
  defaultWeightMetric,
  convertVolume,
  convertWeight,
  convertDistance,
} from './metric';
import { getByPathWithDefault } from './fp';

export const findActiveQuantityField = ({
  producedQuantity,
  preShippedQuantity,
  shippedQuantity,
  postShippedQuantity,
  deliveredQuantity,
}: {
  producedQuantity: ?number,
  preShippedQuantity: ?number,
  shippedQuantity: ?number,
  postShippedQuantity: ?number,
  deliveredQuantity: ?number,
}) => {
  if (deliveredQuantity) return 'deliveredQuantity';

  if (postShippedQuantity) return 'postShippedQuantity';

  if (shippedQuantity) return 'shippedQuantity';

  if (preShippedQuantity) return 'preShippedQuantity';

  if (producedQuantity) return 'producedQuantity';

  return 'quantity';
};

export const getBatchLatestQuantity = (batch: BatchPayload) => {
  const quantity = batch?.quantity ?? 0;
  const deliveredQuantity = batch?.deliveredQuantity;
  const postShippedQuantity = batch?.postShippedQuantity;
  const shippedQuantity = batch?.shippedQuantity;
  const preShippedQuantity = batch?.preShippedQuantity;
  const producedQuantity = batch?.producedQuantity;

  if (deliveredQuantity) return deliveredQuantity;

  if (postShippedQuantity) return postShippedQuantity;

  if (shippedQuantity) return shippedQuantity;

  if (preShippedQuantity) return preShippedQuantity;

  if (producedQuantity) return producedQuantity;

  return quantity;
};

export const findWeight = (batch: BatchPayload) => {
  const packageGrossWeight = batch?.packageGrossWeight;
  const packageQuantity = batch?.packageQuantity ?? 0;
  return packageQuantity && packageGrossWeight
    ? times(
        packageQuantity,
        convertWeight(packageGrossWeight.value, packageGrossWeight.metric, 'kg')
      )
    : 0;
};

export const findVolume = (batch: BatchPayload) => {
  const volume = batch?.packageVolume;
  const packageQuantity = batch?.packageQuantity ?? 0;
  return packageQuantity && volume
    ? times(packageQuantity, convertVolume(volume.value, volume.metric, 'm³'))
    : 0;
};

// DEPRECATED will be removed after remove old RM
export const oldGetBatchLatestQuantity = (batch: BatchPayload): number => {
  const quantity = getByPathWithDefault(0, 'quantity', batch);
  const batchQuantityRevisions = getByPathWithDefault([], 'batchQuantityRevisions', batch);
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
  batchQuantityRevisions: Array<BatchQuantityRevision>,
  orderItem: OrderItemPayload,
}): number => {
  return times(
    getBatchLatestQuantity({ quantity, batchQuantityRevisions }),
    getByPathWithDefault(0, 'price.amount', orderItem)
  );
};

export const calculateVolume = (volume: MetricValue, size: Size): Object => {
  if (
    !getByPathWithDefault('', 'metric', volume) ||
    !getByPathWithDefault('', 'width.metric', size) ||
    !getByPathWithDefault('', 'height.metric', size) ||
    !getByPathWithDefault('', 'length.metric', size)
  ) {
    return volume;
  }

  const metricToConvert = volume.metric === 'cm³' ? 'cm' : 'm';
  // $FlowIgnore ignore this error due to compare String vs literal string value
  const convertedHeight = convertDistance(size.height.value, size.height.metric, metricToConvert);
  // $FlowIgnore ignore this error due to compare String vs literal string value
  const convertedWidth = convertDistance(size.width.value, size.width.metric, metricToConvert);
  // $FlowIgnore ignore this error due to compare String vs literal string value
  const convertedDepth = convertDistance(size.length.value, size.length.metric, metricToConvert);

  const calculatedVolume = times(convertedHeight, convertedWidth, convertedDepth);

  return {
    metric: volume.metric,
    value: calculatedVolume,
  };
};

// DEPRECATED will be removed after remove old RM
export const oldCalculatePackageQuantity = (batch: Batch) => {
  const quantity = getByPathWithDefault(0, 'quantity', batch);
  const packageCapacity = getByPathWithDefault(0, 'packageCapacity', batch);
  const batchQuantityRevisions = getByPathWithDefault([], 'batchQuantityRevisions', batch);
  if (packageCapacity > 0) {
    const validQuantity =
      batchQuantityRevisions.length > 0
        ? batchQuantityRevisions[batchQuantityRevisions.length - 1].quantity
        : quantity;

    return divide(validQuantity, packageCapacity);
  }
  return 0;
};

export const calculatePackageQuantity = (batch: Batch) => {
  const quantity = getBatchLatestQuantity(batch);
  const packageCapacity = batch?.packageCapacity;
  if (packageCapacity > 0) {
    return divide(quantity, packageCapacity);
  }
  return 0;
};

export const generateCloneBatch = (
  { id, deliveredAt, desiredAt, expiredAt, producedAt, no, tags, customFields, ...rest }: Batch,
  hasPermission: Function
) => {
  return {
    ...rest,
    id: uuid(),
    isNew: true,
    no: `${no} - clone`,
    batchQuantityRevisions: [],
    todo: {
      tasks: [],
    },
    tags: hasPermission([BATCH_UPDATE, BATCH_SET_TAGS]) ? tags : [],
    customFields: {
      ...customFields,
      fieldValues: hasPermission([BATCH_UPDATE, BATCH_SET_CUSTOM_FIELDS])
        ? customFields.fieldValues
        : [],
      mask: hasPermission([BATCH_UPDATE, BATCH_SET_CUSTOM_FIELDS_MASK]) ? customFields.mask : null,
    },
  };
};

export const totalVolume = (total: number, packageQuantity: number, volume: MetricValue) =>
  !volume || !packageQuantity
    ? total
    : // $FlowIgnore ignore this error due to compare String vs literal string value
      total + times(packageQuantity, convertVolume(volume.value, volume.metric, 'm³'));

export const findTotalAutoFillBatches = ({
  batches,
  quantity,
}: {
  batches: Array<BatchPayload>,
  quantity: number,
}): Object => {
  const totalBatchQuantity = batches.reduce(
    (total, batch) => total + getBatchLatestQuantity(batch),
    0
  );
  return quantity - totalBatchQuantity;
};

export const generateBatchByOrderItem = (orderItem: OrderItemPayload): Batch => {
  const packageName = getByPathWithDefault('', 'productProvider.defaultPackage.name', orderItem);
  const packageCapacity = getByPathWithDefault(
    0,
    'productProvider.defaultPackage.capacity',
    orderItem
  );
  const packageGrossWeight = getByPathWithDefault(
    {
      metric: defaultWeightMetric,
      value: 0,
    },
    'productProvider.defaultPackage.grossWeight',
    orderItem
  );
  const packageVolume = getByPathWithDefault(
    {
      metric: defaultVolumeMetric,
      value: 0,
    },
    'productProvider.defaultPackage.volume',
    orderItem
  );
  const packageSize = getByPathWithDefault(
    {
      width: {
        metric: defaultDistanceMetric,
        value: 0,
      },
      height: {
        metric: defaultDistanceMetric,
        value: 0,
      },
      length: {
        metric: defaultDistanceMetric,
        value: 0,
      },
    },
    'productProvider.defaultPackage.size',
    orderItem
  );
  const autoCalculatePackageVolume = getByPathWithDefault(
    true,
    'productProvider.defaultPackage.autoCalculateVolume',
    orderItem
  );
  return {
    packageName,
    packageCapacity,
    packageGrossWeight,
    packageVolume,
    packageSize,
    autoCalculatePackageVolume,
    orderItem,
    packageQuantity: 0,
    id: uuid(),
    isNew: true,
    archived: false,
    autoCalculatePackageQuantity: true,
    no: '',
    tags: [],
    sort: 0,
    containerSort: 0,
    shipmentSort: 0,
    quantity: 0,
    latestQuantity: 0,
    customFields: {
      mask: null,
      fieldValues: [],
      fieldDefinitions: [],
    },
    todo: {
      tasks: [],
      taskTemplate: null,
      taskCount: {
        count: 0,
        remain: 0,
        inProgress: 0,
        completed: 0,
        rejected: 0,
        approved: 0,
        skipped: 0,
        delayed: 0,
      },
    },
    createdAt: null,
    updatedAt: null,
    ownedBy: {},
    totalVolume: {
      metric: defaultVolumeMetric,
      value: 0,
    },
  };
};

export const autoFillBatch = (orderItem: OrderItemPayload, quantity: number): Batch => {
  const batch = {
    ...generateBatchByOrderItem(orderItem),
    latestQuantity: quantity,
    quantity,
  };
  return {
    ...batch,
    packageQuantity: calculatePackageQuantity(batch),
  };
};

export const updateBatchCardQuantity = (batch: Batch, quantity: number): Batch => {
  const autoCalculatePackageQuantity = getByPathWithDefault(
    true,
    'autoCalculatePackageQuantity',
    batch
  );
  const batchQuantityRevisions = getByPathWithDefault([], 'batchQuantityRevisions', batch);

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
