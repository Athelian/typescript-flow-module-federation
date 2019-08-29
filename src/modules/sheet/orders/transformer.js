// @flow
import { transformField } from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState';
import {
  ORDER_SET_CURRENCY,
  ORDER_SET_PO_NO,
  ORDER_UPDATE,
} from 'modules/permission/constants/order';
import { ORDER_ITEMS_SET_NO, ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import { BATCH_SET_NO, BATCH_UPDATE } from 'modules/permission/constants/batch';
import { CONTAINER_SET_NO, CONTAINER_UPDATE } from 'modules/permission/constants/container';
import { SHIPMENT_SET_NO, SHIPMENT_UPDATE } from 'modules/permission/constants/shipment';

function transformOrder(basePath: string, order: Object): Array<CellValue> {
  return [
    {
      columnKey: 'order.poNo',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformField(basePath, order, 'poNo', hp => hp(ORDER_UPDATE) || hp(ORDER_SET_PO_NO)),
    },
    {
      columnKey: 'order.currency',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformField(
        basePath,
        order,
        'currency',
        hp => hp(ORDER_UPDATE) || hp(ORDER_SET_CURRENCY)
      ),
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
      ...transformField(
        basePath,
        orderItem,
        'no',
        hp => hp(ORDER_ITEMS_UPDATE) || hp(ORDER_ITEMS_SET_NO)
      ),
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
      ...transformField(basePath, batch, 'no', hp => hp(BATCH_UPDATE) || hp(BATCH_SET_NO)),
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
      ...transformField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'no',
        hp => hp(CONTAINER_UPDATE) || hp(CONTAINER_SET_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.no',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'no',
        hp => hp(SHIPMENT_UPDATE) || hp(SHIPMENT_SET_NO)
      ),
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
