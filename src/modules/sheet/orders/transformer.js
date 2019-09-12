// @flow
import { transformValueField, transformReadonlyField } from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  ORDER_SET_CURRENCY,
  ORDER_SET_PO_NO,
  ORDER_SET_PI_NO,
  ORDER_SET_DELIVERY_PLACE,
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
      ...transformValueField(
        basePath,
        order,
        'poNo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_PO_NO)
      ),
    },
    {
      columnKey: 'order.piNo',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformValueField(
        basePath,
        order,
        'piNo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_PI_NO)
      ),
    },
    {
      columnKey: 'order.currency',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformValueField(
        basePath,
        order,
        'currency',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_CURRENCY)
      ),
    },
    {
      columnKey: 'order.deliveryPlace',
      type: 'text',
      empty: !order,
      parent: true,
      ...transformValueField(
        basePath,
        order,
        'deliveryPlace',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_DELIVERY_PLACE)
      ),
    },
    {
      columnKey: 'order.created',
      type: 'date_user',
      empty: !order,
      parent: true,
      ...transformReadonlyField(
        basePath,
        order,
        'created',
        order
          ? {
              at: new Date(order.createdAt),
              by: order.createdBy,
            }
          : null
      ),
    },
    {
      columnKey: 'order.updated',
      type: 'date_user',
      empty: !order,
      parent: true,
      ...transformReadonlyField(
        basePath,
        order,
        'updated',
        order
          ? {
              at: new Date(order.updatedAt),
              by: order.updatedBy,
            }
          : null
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
      ...transformValueField(
        basePath,
        orderItem,
        'no',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_NO)
      ),
    },
    /* {
      columnKey: 'order.orderItem.quantity',
      type: 'number',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformValueField(basePath, orderItem, 'quantity', () => true),
    }, */
    {
      columnKey: 'order.orderItem.created',
      type: 'date_user',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformReadonlyField(
        basePath,
        orderItem,
        'created',
        orderItem
          ? {
              at: new Date(orderItem.createdAt),
              by: orderItem.createdBy,
            }
          : null
      ),
    },
    {
      columnKey: 'order.orderItem.updated',
      type: 'date_user',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformReadonlyField(
        basePath,
        orderItem,
        'updated',
        orderItem
          ? {
              at: new Date(orderItem.updatedAt),
              by: orderItem.updatedBy,
            }
          : null
      ),
    },
  ];
};

const transformBatch = (basePath: string, batch: Object): Array<CellValue> => {
  return [
    {
      columnKey: 'order.orderItem.batch.no',
      type: 'text',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'no',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_NO)
      ),
    },
    /* {
      columnKey: 'order.orderItem.batch.quantity',
      type: 'number',
      disabled: !batch,
      ...transformValueField(basePath, batch, 'quantity', () => true),
    }, */
    {
      columnKey: 'order.orderItem.batch.created',
      type: 'date_user',
      disabled: !batch,
      ...transformReadonlyField(
        basePath,
        batch,
        'created',
        batch
          ? {
              at: new Date(batch.createdAt),
              by: batch.createdBy,
            }
          : null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.updated',
      type: 'date_user',
      disabled: !batch,
      ...transformReadonlyField(
        basePath,
        batch,
        'updated',
        batch
          ? {
              at: new Date(batch.updatedAt),
              by: batch.updatedBy,
            }
          : null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.no',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformValueField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'no',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.no',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'no',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_NO)
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
