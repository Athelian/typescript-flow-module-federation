// @flow
import { transformField } from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState';

function transformOrder(basePath: string, order: Object): Array<CellValue> {
  return [
    {
      columnKey: 'order.poNo',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformField(basePath, order, 'poNo', () => true),
    },
    {
      columnKey: 'order.currency',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformField(basePath, order, 'currency', () => true),
    },
  ];
}

const transformOrderItem = (
  basePath: string,
  orderItem: Object,
  hasItems: boolean
): Array<CellValue> => {
  return [
    {
      columnKey: 'order.orderItem.no',
      type: 'text',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformField(basePath, orderItem, 'no', () => true),
    },
    /* {
      columnKey: 'order.orderItem.quantity',
      type: 'number',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformField(basePath, orderItem, 'quantity', () => true),
    }, */
  ];
};

const transformBatch = (basePath: string, batch: Object): Array<CellValue> => {
  return [
    {
      columnKey: 'order.orderItem.batch.no',
      type: 'text',
      disabled: !batch,
      ...transformField(basePath, batch, 'no', () => true),
    },
    /* {
      columnKey: 'order.orderItem.batch.quantity',
      type: 'number',
      disabled: !batch,
      ...transformField(basePath, batch, 'quantity', () => true),
    }, */
    {
      columnKey: 'order.orderItem.batch.container.no',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformField(`${basePath}.container`, batch ? batch.container : null, 'no', () => true),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.no',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformField(`${basePath}.shipment`, batch ? batch.shipment : null, 'no', () => true),
    },
  ];
};

export default function transformer(index: number, order: Object): Array<Array<CellValue>> {
  const rows = [];

  let orderCells = transformOrder(`${index}`, order);

  if (order.orderItems.length > 0) {
    order.orderItems.forEach((orderItem, orderItemIdx) => {
      let orderItemCells = transformOrderItem(
        `${index}.orderItems.${orderItemIdx}`,
        orderItem,
        true
      );

      if (orderItem.batches.length > 0) {
        orderItem.batches.forEach((batch, batchIdx) => {
          rows.push([
            ...orderCells,
            ...orderItemCells,
            ...transformBatch(`${index}.orderItems.${orderItemIdx}.batches.${batchIdx}`, batch),
          ]);
          orderCells = transformOrder(`${index}`, null);
          orderItemCells = transformOrderItem(`${index}.orderItems.${orderItemIdx}`, null, true);
        });
      } else {
        rows.push([
          ...orderCells,
          ...transformOrderItem(`${index}.orderItems.${orderItemIdx}`, orderItem, true),
          ...transformBatch(`${index}.orderItems.${orderItemIdx}.batches.0`, null),
        ]);
        orderCells = transformOrder(`${index}`, null);
      }
    });
  } else {
    rows.push([
      ...orderCells,
      ...transformOrderItem(`${index}.orderItems.0`, null, false),
      ...transformBatch(`${index}.orderItems.0.batches.0`, null),
    ]);
  }

  return rows;
}
