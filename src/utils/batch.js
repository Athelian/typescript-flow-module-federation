// @flow
import { injectUid } from './id';

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
