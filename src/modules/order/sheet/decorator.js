// @flow

/**
 * This is used to do clean up the data for cell input
 * Eg: toggle input which combine 2 values
 */
export function decorate(orders: Array<Object>): Array<Object> {
  return orders.map(order => ({
    ...order,
    orderItems: order.orderItems.map(orderItem => ({
      ...orderItem,
      batches: orderItem.batches.map(batch => ({
        ...batch,
        packageQuantity: {
          value: batch.packageQuantity || 0,
          auto: batch.autoCalculatePackageQuantity || false,
        },
        container: batch?.container
          ? {
              ...batch?.container,
              freeTimeStartDate: {
                value: batch?.container?.freeTimeStartDate,
                auto: batch?.container?.autoCalculatedFreeTimeStartDate ?? false,
              },
            }
          : null,
      })),
    })),
  }));
}

export default decorate;
