// @flow

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
      })),
    })),
  }));
}
