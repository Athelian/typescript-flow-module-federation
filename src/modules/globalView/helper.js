// @flow
export const orderFields = ['name', 'others'];
export const orderItemFields = ['name', 'others'];
export const batchFields = ['name', 'others'];
export const containerFields = ['name', 'others'];
export const shipmentFields = ['name', 'others'];

export const transfer = ({
  data,
  type,
  fields,
  lines,
}: {
  data: Object,
  type: string,
  fields: Array<string>,
  lines: number,
}) => {
  if (data && data.id) {
    return fields.map<Object>(field => ({
      key: `${type}.${data.id}.${field}`,
      value: data[field],
      lines,
    }));
  }

  return fields.map<Object>(() => null);
};

export const transferBatch = (batch: Object) => {
  const { container, shipment, ...rest } = batch || {};

  return [
    ...transfer({
      data: rest,
      type: 'batch',
      fields: batchFields,
      lines: 1,
    }),
    ...transfer({
      data: container,
      type: 'container',
      fields: containerFields,
      lines: 1,
    }),
    ...transfer({
      data: shipment,
      type: 'shipment',
      fields: shipmentFields,
      lines: 1,
    }),
  ];
};

export const transferOrderItem = (parentData: Array<Object>, orderItem: Object) => {
  const { batches, ...rest } = orderItem;
  const orderItemData = transfer({
    data: rest,
    type: 'orderItem',
    fields: orderItemFields,
    lines: Array.isArray(batches) ? batches.length : 1,
  });
  if (Array.isArray(batches)) {
    return batches.flatMap(batch => {
      return [[...parentData, ...orderItemData, ...transferBatch(batch)]];
    });
  }
  return [[...parentData, ...orderItemData, ...transferBatch(null)]];
};

export const transferOrder = (order: Object, start: number) => {
  const { orderItems, ...rest } = order;

  if (Array.isArray(orderItems)) {
    const orderLines = orderItems
      .map(({ batches }) => {
        if (Array.isArray(batches)) {
          return batches.length;
        }
        return 1;
      })
      .reduce((a, b) => a + b);

    const orderData = transfer({
      data: rest,
      type: 'order',
      fields: orderFields,
      lines: orderLines,
    });
    return orderItems.flatMap<Object>(orderItem => {
      return transferOrderItem(orderData, orderItem);
    });
  }
  return [
    [
      ...transfer({
        data: rest,
        type: 'order',
        fields: orderFields,
        lines: 1,
        start,
      }),
      ...orderItemFields.map<Object>(() => null),
      ...batchFields.map<Object>(() => null),
      ...containerFields.map<Object>(() => null),
      ...shipmentFields.map<Object>(() => null),
    ],
  ];
};
