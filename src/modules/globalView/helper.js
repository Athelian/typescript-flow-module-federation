// @flow
export const transferOfOrder = (order: Object) => {
  const { id, orderItems, ...rest } = order;
  const entries = Object.entries(rest).map(([key, value]) => {
    return {
      key: `order.${id}.${key}`,
      value,
    };
  });
  return [...entries];
};

export const transferOfOrderItem = (orderItem: Object) => {
  const { id, batches, ...rest } = orderItem;
  const entries = Object.entries(rest).map(([key, value]) => {
    return {
      key: `orderItem.${id}.${key}`,
      value,
    };
  });
  return [...entries];
};

export const transferOfBatch = (batch: Object) => {
  const { id, shipment, container, ...rest } = batch;
  const entries = Object.entries(rest).map(([key, value]) => {
    return {
      key: `batch.${id}.${key}`,
      value,
    };
  });

  return [...entries];
};

export const transferOfContainer = (container: Object) => {
  const { id, ...rest } = container;
  const entries = Object.entries(rest).map(([key, value]) => {
    return {
      key: `container.${id}.${key}`,
      value,
    };
  });
  return [...entries];
};

export const transferOfShipment = (shipment: Object) => {
  const { id, ...rest } = shipment;
  const entries = Object.entries(rest).map(([key, value]) => {
    return {
      key: `shipment.${id}.${key}`,
      value,
    };
  });
  return [...entries];
};
