// @flow
import { transformValueField, transformReadonlyField } from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  ORDER_SET_CURRENCY,
  ORDER_SET_PO_NO,
  ORDER_SET_PI_NO,
  ORDER_SET_DELIVERY_PLACE,
  ORDER_UPDATE,
  ORDER_SET_DELIVERY_DATE,
  ORDER_SET_ISSUE_AT,
  ORDER_SET_INCOTERM,
  ORDER_SET_MEMO,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_SET_NO,
  ORDER_ITEMS_SET_QUANTITY,
  ORDER_ITEMS_SET_PRICE,
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_DELIVERY_DATE,
} from 'modules/permission/constants/orderItem';
import {
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_EXPIRY,
  BATCH_SET_NO,
  BATCH_SET_PACKAGE_CAPACITY,
  BATCH_SET_PACKAGE_NAME,
  BATCH_SET_PACKAGE_QUANTITY,
  BATCH_SET_PRODUCTION_DATE,
  BATCH_SET_QUANTITY,
  BATCH_UPDATE,
} from 'modules/permission/constants/batch';
import {
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_DEPARTURE_DATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_YARD_NAME,
  CONTAINER_UPDATE,
} from 'modules/permission/constants/container';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_SET_NO,
  SHIPMENT_SET_BL_NO,
  SHIPMENT_SET_BL_DATE,
  SHIPMENT_SET_BOOKING_NO,
  SHIPMENT_SET_INVOICE_NO,
  SHIPMENT_SET_CONTRACT_NO,
  SHIPMENT_SET_CARRIER,
} from 'modules/permission/constants/shipment';

function transformOrder(basePath: string, order: Object): Array<CellValue> {
  return [
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
      columnKey: 'order.issuedAt',
      type: 'date',
      empty: !order,
      parent: true,
      ...transformValueField(
        basePath,
        order,
        'issuedAt',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_ISSUE_AT)
      ),
    },
    {
      columnKey: 'order.deliveryDate',
      type: 'date',
      empty: !order,
      parent: true,
      ...transformValueField(
        basePath,
        order,
        'deliveryDate',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'order.currency',
      type: 'currency',
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
      columnKey: 'order.incoterm',
      type: 'incoterm',
      empty: !order,
      parent: true,
      ...transformValueField(
        basePath,
        order,
        'incoterm',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_INCOTERM)
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
      columnKey: 'order.memo',
      type: 'textarea',
      empty: !order,
      parent: true,
      ...transformValueField(
        basePath,
        order,
        'memo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_MEMO)
      ),
    },
    {
      columnKey: 'order.totalOrdered',
      type: 'number',
      empty: !order,
      parent: true,
      ...transformReadonlyField(basePath, order, 'totalOrdered', order?.totalOrdered ?? 0),
    },
    {
      columnKey: 'order.totalBatched',
      type: 'number',
      empty: !order,
      parent: true,
      ...transformReadonlyField(basePath, order, 'totalBatched', order?.totalBatched ?? 0),
    },
    {
      columnKey: 'order.totalShipped',
      type: 'number',
      empty: !order,
      parent: true,
      ...transformReadonlyField(basePath, order, 'totalShipped', order?.totalShipped ?? 0),
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
    {
      columnKey: 'order.orderItem.quantity',
      type: 'number',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformValueField(
        basePath,
        orderItem,
        'quantity',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'order.orderItem.price',
      type: 'price',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformValueField(
        basePath,
        orderItem,
        'price',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_PRICE)
      ),
    },
    {
      columnKey: 'order.orderItem.totalBatched',
      type: 'number',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformReadonlyField(basePath, orderItem, 'totalBatched', orderItem?.totalBatched ?? 0),
    },
    {
      columnKey: 'order.orderItem.totalShipped',
      type: 'number',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformReadonlyField(basePath, orderItem, 'totalShipped', orderItem?.totalShipped ?? 0),
    },
    {
      columnKey: 'order.orderItem.deliveryDate',
      type: 'date',
      disabled: !hasItems && !orderItem,
      empty: hasItems && !orderItem,
      parent: true,
      ...transformValueField(
        basePath,
        orderItem,
        'deliveryDate',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_DELIVERY_DATE)
      ),
    },
  ];
};

const transformBatch = (basePath: string, batch: Object): Array<CellValue> => {
  return [
    // BATCH
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
    {
      columnKey: 'order.orderItem.batch.deliveredAt',
      type: 'date',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'deliveredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.desiredAt',
      type: 'date',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'desiredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_DESIRED_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.expiredAt',
      type: 'date',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'expiredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_EXPIRY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.producedAt',
      type: 'date',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'producedAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PRODUCTION_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.quantity',
      type: 'number',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'quantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.packageName',
      type: 'text',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'packageName',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_NAME)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.packageCapacity',
      type: 'number',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'packageCapacity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_CAPACITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.packageQuantity',
      type: 'number',
      disabled: !batch,
      ...transformValueField(
        basePath,
        batch,
        'packageQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_QUANTITY)
      ),
    },
    // CONTAINER
    {
      columnKey: 'order.orderItem.batch.container.created',
      type: 'date_user',
      disabled: !batch,
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'created',
        batch?.container
          ? {
              at: new Date(batch?.container?.createdAt),
              by: batch?.container?.createdBy,
            }
          : null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.updated',
      type: 'date_user',
      disabled: !batch,
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'updated',
        batch?.container
          ? {
              at: new Date(batch?.container?.updatedAt),
              by: batch?.container?.updatedBy,
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
      columnKey: 'order.orderItem.batch.container.warehouseArrivalAgreedDate',
      type: 'datetime',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformValueField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'warehouseArrivalAgreedDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_AGREE_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.warehouseArrivalActualDate',
      type: 'datetime',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformValueField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'warehouseArrivalActualDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_ACTUAL_ARRIVAL_DATE)
      ),
    },
    // start date
    {
      columnKey: 'order.orderItem.batch.container.yardName',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformValueField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'yardName',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_YARD_NAME)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.departureDate',
      type: 'date',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformValueField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'departureDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_DEPARTURE_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.totalPackageQuantity',
      type: 'number',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformReadonlyField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'totalPackageQuantity',
        batch?.container?.totalPackageQuantity ?? 0
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.totalQuantity',
      type: 'number',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformReadonlyField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'totalQuantity',
        batch?.container?.totalQuantity ?? 0
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.orderItemCount',
      type: 'number',
      duplicatable: true,
      disabled: !(batch ? batch.container : null),
      ...transformReadonlyField(
        `${basePath}.container`,
        batch ? batch.container : null,
        'orderItemCount',
        batch?.container?.orderItemCount ?? 0
      ),
    },
    // SHIPMENT
    {
      columnKey: 'order.orderItem.batch.shipment.created',
      type: 'date_user',
      disabled: !batch,
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'created',
        batch?.shipment
          ? {
              at: new Date(batch?.shipment?.createdAt),
              by: batch?.shipment?.createdBy,
            }
          : null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.updated',
      type: 'date_user',
      disabled: !batch,
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'updated',
        batch?.shipment
          ? {
              at: new Date(batch?.shipment?.updatedAt),
              by: batch?.shipment?.updatedBy,
            }
          : null
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
    {
      columnKey: 'order.orderItem.batch.shipment.blNo',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'blNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.blDate',
      type: 'date',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'blDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.bookingNo',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'bookingNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.invoiceNo',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'invoiceNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INVOICE_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.contractNo',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'contractNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CONTRACT_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.carrier',
      type: 'text',
      duplicatable: true,
      disabled: !(batch ? batch.shipment : null),
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'carrier',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CARRIER)
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
