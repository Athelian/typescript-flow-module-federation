// @flow
import { set, cloneDeep } from 'lodash';
import type {
  MetricValue,
  Size,
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
import { injectUid } from './id';
import { convertVolume, convertWeight } from './metric';
import { getByPathWithDefault } from './fp';

export const findWeight = (batch: BatchPayload) => {
  const packageGrossWeight = getByPathWithDefault(null, 'packageGrossWeight', batch);
  const packageQuantity = getByPathWithDefault(0, 'packageQuantity', batch);
  return packageQuantity && packageGrossWeight
    ? times(
        packageQuantity,
        convertWeight(packageGrossWeight.value, packageGrossWeight.metric, 'kg')
      )
    : 0;
};

export const findVolume = (batch: BatchPayload) => {
  const volume = getByPathWithDefault(null, 'volume', batch);
  const packageQuantity = getByPathWithDefault(0, 'packageQuantity', batch);
  return packageQuantity && volume
    ? times(packageQuantity, convertVolume(volume.value, volume.metric, 'm³'))
    : 0;
};

export const getBatchLatestQuantity = (batch: BatchPayload): number => {
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
  const heightValue =
    size.height.metric === 'cm' ? size.height.value : times(size.height.value, 100);
  const widthValue = size.width.metric === 'cm' ? size.width.value : times(size.width.value, 100);
  const lengthValue =
    size.length.metric === 'cm' ? size.length.value : times(size.length.value, 100);
  const volumeValue = times(heightValue, widthValue, lengthValue);

  return {
    metric: volume.metric,
    value: volume.metric === 'cm³' ? volumeValue : divide(volumeValue, 1000000),
  };
};

export const calculatePackageQuantity = (batch: BatchPayload) => {
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

export const generateCloneBatch = (
  { id, deliveredAt, desired, expiredAt, producedAt, no, ...rest }: Object,
  hasPermission: Function
) => {
  return injectUid({
    ...rest,
    isNew: true,
    no: `${no} - clone`,
    batchQuantityRevisions: [],
    todo: {
      tasks: [],
    },
    tags: hasPermission([BATCH_UPDATE, BATCH_SET_TAGS]) ? rest.tags : [],
    customFields: {
      ...rest.customFields,
      fieldValues: hasPermission([BATCH_UPDATE, BATCH_SET_CUSTOM_FIELDS])
        ? rest.customFields.fieldValues
        : [],
      mask: hasPermission([BATCH_UPDATE, BATCH_SET_CUSTOM_FIELDS_MASK])
        ? rest.customFields.mask
        : null,
    },
  });
};

export const totalVolume = (total: number, packageQuantity: number, volume: MetricValue) =>
  !volume || !packageQuantity
    ? total
    : total +
      times(
        packageQuantity,
        volume.metric !== 'cm³' ? volume.value : divide(volume.value, 1000000)
      );

export const findTotalAutoFillBatches = ({
  batches,
  quantity,
}: {
  batches: Array<BatchPayload>,
  quantity: number,
}): Object => {
  const totalBatchQuantity = batches.reduce(
    (total, batch) =>
      total + (getByPathWithDefault(0, 'latestQuantity', batch) || getBatchLatestQuantity(batch)),
    0
  );
  return quantity - totalBatchQuantity;
};

export const generateBatchByOrderItem = ({ productProvider }: { productProvider: Object }) => {
  const { packageName, packageCapacity, packageGrossWeight, volume, size } = productProvider;
  return injectUid({
    tags: [],
    packageName,
    packageCapacity,
    packageGrossWeight,
    volume,
    size,
    quantity: 0,
    packageQuantity: 0,
    isNew: true,
    batchQuantityRevisions: [],
    autoCalculatePackageQuantity: true,
    customFields: {
      mask: null,
      fieldValues: [],
    },
    todo: {
      tasks: [],
      taskTemplate: null,
    },
  });
};

export const updateBatchCardQuantity = (batch: BatchPayload, quantity: number): Object => {
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
