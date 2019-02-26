// @flow

import { findBatchQuantity, calculatePackageQuantity } from 'utils/batch';
import { injectUid } from 'utils/id';

export const getBatchesSummary = (order: Object) => {
  let totalBatches = 0;
  let shippedBatches = 0;

  if (order.orderItems) {
    order.orderItems.forEach(item => {
      if (item.batches) {
        totalBatches += item.batches.length;
        item.batches.forEach(batch => {
          if (batch.shipment) {
            shippedBatches += 1;
          }
        });
      }
    });
  }

  return { totalBatches, shippedBatches, unshippedBatches: totalBatches - shippedBatches };
};

export const getQuantitySummary = (orderItems: Array<Object>) => {
  let orderedQuantity = 0;
  let batchedQuantity = 0;
  let shippedQuantity = 0;
  let totalPrice = 0;
  let totalItems = 0;
  let activeBatches = 0;
  let archivedBatches = 0;

  if (orderItems) {
    totalItems = orderItems.length;

    orderItems.forEach(item => {
      const qty = item.quantity ? item.quantity : 0;
      const price = item.price ? item.price.amount : 0;
      orderedQuantity += qty;
      totalPrice += price * qty;

      if (item.batches) {
        item.batches.forEach(batch => {
          batchedQuantity += batch.quantity;

          let currentQuantity = batch.quantity;

          if (batch.batchAdjustments) {
            batch.batchAdjustments.forEach(batchAdjustment => {
              batchedQuantity += batchAdjustment.quantity;
              currentQuantity += batchAdjustment.quantity;
            });
          }

          if (batch.shipment) {
            shippedQuantity += currentQuantity;
          }

          if (batch.archived) {
            archivedBatches += 1;
          } else {
            activeBatches += 1;
          }
        });
      }
    });
  }

  return {
    orderedQuantity,
    batchedQuantity,
    shippedQuantity,
    totalPrice,
    totalItems,
    activeBatches,
    archivedBatches,
  };
};

export const sumBatchQuantity = (total: number, batch: Object) => total + findBatchQuantity(batch);

export const getBatchByFillBatch = (orderItem: Object) => {
  const { batches = [] } = orderItem;
  const totalBatchQuantity = batches.reduce((total, batch) => total + findBatchQuantity(batch), 0);
  const wantingBatchQuantity = orderItem.quantity - totalBatchQuantity;
  if (wantingBatchQuantity > 0) {
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
      no: `batch no ${batches.length + 1}`,
      orderItem,
      tags: [],
      packageName,
      packageCapacity,
      packageGrossWeight,
      packageVolume,
      packageSize,
      quantity: wantingBatchQuantity,
      batchAdjustments: [],
      autoCalculatePackageQuantity: true,
      packageQuantity: calculatePackageQuantity({
        batchAdjustments: [],
        packageCapacity,
        quantity: wantingBatchQuantity,
      }),
    });
  }
  return null;
};

export const getOrderItemByFillBatch = (orderItem: Object) => {
  const { batches = [], quantity } = orderItem;
  const totalBatchQuantity = batches.reduce(sumBatchQuantity, 0);
  const wantingBatchQuantity = quantity - totalBatchQuantity;
  if (wantingBatchQuantity > 0) {
    const {
      productProvider: {
        packageName,
        packageCapacity,
        packageGrossWeight,
        packageVolume,
        packageSize,
      },
    } = orderItem;
    return {
      ...orderItem,
      batches: [
        ...batches,
        injectUid({
          orderItem,
          tags: [],
          packageName,
          packageCapacity,
          packageGrossWeight,
          packageVolume,
          packageSize,
          quantity: wantingBatchQuantity,
          isNew: true,
          batchAdjustments: [],
          no: `batch no ${batches.length + 1}`,
          autoCalculatePackageQuantity: true,
          packageQuantity: calculatePackageQuantity({
            batchAdjustments: [],
            packageCapacity,
            quantity: wantingBatchQuantity,
          }),
        }),
      ],
    };
  }
  return orderItem;
};
