// @flow
import { transformField } from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState';

function transformOrder(order: Object): Array<CellValue> {
  return [
    {
      columnKey: 'order.poNo',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformField(null, order, 'poNo', () => true),
    },
    {
      columnKey: 'order.currency',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformField(null, order, 'currency', () => true),
    },
  ];
}

const transformOrderItem = (
  itemIdx: number,
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
      ...transformField(`orderItems.${itemIdx}`, orderItem, 'no', () => true),
    },
    /* {
      columnKey: 'order.orderItem.quantity',
      type: 'number',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformField(`orderItems.${itemIdx}`, orderItem, 'quantity', () => true),
    }, */
  ];
};

const transformBatch = (itemIdx: number, batchIdx: number, batch: Object): Array<CellValue> => {
  return [
    {
      columnKey: 'order.orderItem.batch.no',
      type: 'text',
      disabled: !batch,
      ...transformField(`orderItems.${itemIdx}.batches.${batchIdx}`, batch, 'no', () => true),
    },
    /* {
      columnKey: 'order.orderItem.batch.quantity',
      type: 'number',
      disabled: !batch,
      ...transformField(`orderItems.${itemIdx}.batches.${batchIdx}`, batch, 'quantity', () => true),
    }, */
    {
      columnKey: 'order.orderItem.batch.container.no',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformField(
        `orderItems.${itemIdx}.batches.${batchIdx}.container`,
        batch ? batch.container : null,
        'no',
        () => true
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.no',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
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
      let orderItemCells = transformOrderItem(orderItemIdx, orderItem, true);

      if (orderItem.batches.length > 0) {
        orderItem.batches.forEach((batch, batchIdx) => {
          rows.push([
            ...orderCells,
            ...orderItemCells,
            ...transformBatch(orderItemIdx, batchIdx, batch),
          ]);
          orderCells = transformOrder(null);
          orderItemCells = transformOrderItem(orderItemIdx, null, true);
        });
      } else {
        rows.push([
          ...orderCells,
          ...transformOrderItem(0, orderItem, true),
          ...transformBatch(0, 0, null),
        ]);
        orderCells = transformOrder(null);
      }
    });
  } else {
    rows.push([
      ...orderCells,
      ...transformOrderItem(0, null, false),
      ...transformBatch(0, 0, null),
    ]);
  }

  return rows;
}
