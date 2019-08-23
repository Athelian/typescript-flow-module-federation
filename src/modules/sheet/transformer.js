// @flow
import { transformField } from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState';

function transformOrder(order: Object): Array<CellValue> {
  return [
    {
      columnKey: 'order.poNo',
      ...transformField(null, order, 'poNo', () => true),
    },
    {
      columnKey: 'order.currency',
      ...transformField(null, order, 'currency', () => true),
    },
  ];
}

const transformOrderItem = (itemIdx: number, orderItem: Object): Array<CellValue> => {
  return [
    {
      columnKey: 'order.orderItem.no',
      ...transformField(`orderItems.${itemIdx}`, orderItem, 'no', () => true),
    },
    {
      columnKey: 'order.orderItem.quantity',
      ...transformField(`orderItems.${itemIdx}`, orderItem, 'quantity', () => true),
    },
  ];
};

const transformBatch = (itemIdx: number, batchIdx: number, batch: Object): Array<CellValue> => {
  return [
    {
      columnKey: 'order.orderItem.batch.no',
      ...transformField(`orderItems.${itemIdx}.batches.${batchIdx}`, batch, 'no', () => true),
    },
    {
      columnKey: 'order.orderItem.batch.quantity',
      ...transformField(`orderItems.${itemIdx}.batches.${batchIdx}`, batch, 'quantity', () => true),
    },
    {
      columnKey: 'order.orderItem.batch.container.no',
      duplicatable: true,
      ...transformField(
        `orderItems.${itemIdx}.batches.${batchIdx}.container`,
        batch ? batch.container : null,
        'no',
        () => true
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.no',
      duplicatable: true,
      ...transformField(
        `orderItems.${itemIdx}.batches.${batchIdx}.shipment`,
        batch ? batch.shipment : null,
        'no',
        () => true
      ),
    },
  ];
};

export function transformer(order: Object): Array<Array<CellValue>> {
  const rows = [];

  let orderCells = transformOrder(order);

  if (order.orderItems.length > 0) {
    order.orderItems.forEach((orderItem, orderItemIdx) => {
      let orderItemCells = transformOrderItem(orderItemIdx, orderItem);

      if (orderItem.batches.length > 0) {
        orderItem.batches.forEach((batch, batchIdx) => {
          rows.push([
            ...orderCells,
            ...orderItemCells,
            ...transformBatch(orderItemIdx, batchIdx, batch),
          ]);
          orderCells = transformOrder(null);
          orderItemCells = transformOrderItem(orderItemIdx, null);
        });
      } else {
        rows.push([
          ...orderCells,
          ...transformOrderItem(0, orderItem),
          ...transformBatch(0, 0, null),
        ]);
        orderCells = transformOrder(null);
      }
    });
  } else {
    rows.push([...orderCells, ...transformOrderItem(0, null), ...transformBatch(0, 0, null)]);
  }

  return rows;
}
