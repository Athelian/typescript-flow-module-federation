// @flow
export const OrderFields = ['poNo', 'currency'];
export const OrderItemFields = ['no', 'quantity'];
export const BatchFields = ['no', 'quantity'];
export const ContainerFields = ['no'];
export const ShipmentFields = ['no'];

export const transfer = ({
  data,
  type,
  fields,
  lines,
  start,
}: {
  data: Object,
  type: string,
  fields: Array<string>,
  lines: number,
  start: number,
}) => {
  if (data && data.id) {
    return fields.map<Object>(field => ({
      key: `${type}.${data.id}.${field}`,
      value: data[field],
      lines,
      start,
    }));
  }

  return fields.map<Object>(() => null);
};

export const transferOrder = ({
  order,
  rowIndex,
  orderFields,
  orderItemFields,
  batchFields,
  containerFields,
  shipmentFields,
}: {
  order: Object,
  rowIndex: number,
  orderFields: Array<string>,
  orderItemFields: Array<string>,
  batchFields: Array<string>,
  containerFields: Array<string>,
  shipmentFields: Array<string>,
}) => {
  const { orderItems, ...rest } = order;
  if (orderItems && orderItems.length > 0) {
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
      start: rowIndex,
    });

    const result = [];
    orderItems.forEach(orderItem => {
      const { batches, ...orderItemRest } = orderItem;
      const orderItemRowIndex = rowIndex + result.length;
      if (Array.isArray(batches)) {
        const orderItemData = transfer({
          data: orderItemRest,
          type: 'orderItem',
          fields: orderItemFields,
          lines: batches.length,
          start: orderItemRowIndex,
        });

        batches.forEach(batch => {
          const { container, shipment, ...batchRest } = batch;
          const batchIndex = rowIndex + result.length;
          const fullData = [
            ...orderData,
            ...orderItemData,
            ...transfer({
              data: batchRest,
              type: 'batch',
              fields: batchFields,
              lines: 1,
              start: batchIndex,
            }),
            ...transfer({
              data: container,
              type: 'container',
              fields: containerFields,
              lines: 1,
              start: batchIndex,
            }),
            ...transfer({
              data: shipment,
              type: 'shipment',
              fields: shipmentFields,
              lines: 1,
              start: batchIndex,
            }),
          ];
          result.push(fullData);
        });
      } else {
        const orderItemData = transfer({
          data: orderItemRest,
          type: 'orderItem',
          fields: orderItemFields,
          lines: 1,
          start: orderItemRowIndex,
        });
        const fullData = [
          ...orderData,
          ...orderItemData,
          ...batchFields.map<Object>(() => null),
          ...containerFields.map<Object>(() => null),
          ...shipmentFields.map<Object>(() => null),
        ];
        result.push(fullData);
      }
    });
    return result;
  }
  return [
    [
      ...transfer({
        data: rest,
        type: 'order',
        fields: orderFields,
        lines: 1,
        start: rowIndex,
      }),
      ...orderItemFields.map<Object>(() => null),
      ...batchFields.map<Object>(() => null),
      ...containerFields.map<Object>(() => null),
      ...shipmentFields.map<Object>(() => null),
    ],
  ];
};
