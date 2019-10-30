// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { addDays } from 'date-fns';
import { getBatchLatestQuantity } from 'utils/batch';
import { getLatestDate } from 'utils/shipment';
import {
  transformComputedField,
  transformReadonlyField,
  transformValueField,
} from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  ORDER_UPDATE,
  ORDER_SET_ARCHIVED,
  ORDER_SET_CURRENCY,
  ORDER_SET_IN_CHARGES,
  ORDER_SET_EXPORTER,
  ORDER_SET_PO_NO,
  ORDER_SET_PI_NO,
  ORDER_SET_DELIVERY_PLACE,
  ORDER_SET_DELIVERY_DATE,
  ORDER_SET_DOCUMENTS,
  ORDER_SET_INCOTERM,
  ORDER_SET_ISSUE_AT,
  ORDER_SET_MEMO,
  ORDER_TASK_SET_TAGS,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_SET_DELIVERY_DATE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_SET_NO,
  ORDER_ITEMS_SET_PRICE,
  ORDER_ITEMS_SET_QUANTITY,
  ORDER_ITEMS_SET_TAGS,
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_MEMO,
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
  BATCH_SET_QUANTITY_ADJUSTMENTS,
  BATCH_SET_TAGS,
  BATCH_UPDATE,
  BATCH_SET_MEMO,
} from 'modules/permission/constants/batch';
import {
  CONTAINER_ASSIGN_ACTUAL_ARRIVAL_DATE,
  CONTAINER_ASSIGN_AGREE_ARRIVAL_DATE,
  CONTAINER_ASSIGN_DEPARTURE_DATE,
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_CONTAINER_OPTION,
  CONTAINER_SET_CONTAINER_TYPE,
  CONTAINER_SET_DEPARTURE_DATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_TAGS,
  CONTAINER_SET_FREE_TIME_START_DATE,
  CONTAINER_SET_YARD_NAME,
  CONTAINER_UPDATE,
  CONTAINER_SET_MEMO,
} from 'modules/permission/constants/container';
import {
  SHIPMENT_SET_ARCHIVED,
  SHIPMENT_SET_BL_DATE,
  SHIPMENT_SET_BL_NO,
  SHIPMENT_SET_BOOKED,
  SHIPMENT_SET_BOOKING_DATE,
  SHIPMENT_SET_BOOKING_NO,
  SHIPMENT_SET_CARRIER,
  SHIPMENT_SET_CONTRACT_NO,
  SHIPMENT_SET_DOCUMENTS,
  SHIPMENT_SET_IN_CHARGE,
  SHIPMENT_SET_FORWARDERS,
  SHIPMENT_SET_INCOTERM,
  SHIPMENT_SET_INVOICE_NO,
  SHIPMENT_SET_LOAD_TYPE,
  SHIPMENT_SET_NO,
  SHIPMENT_SET_PORT,
  SHIPMENT_SET_REVISE_TIMELINE_DATE,
  SHIPMENT_SET_TAGS,
  SHIPMENT_SET_TIMELINE_DATE,
  SHIPMENT_SET_TRANSPORT_TYPE,
  SHIPMENT_UPDATE,
  SHIPMENT_SET_MEMO,
} from 'modules/permission/constants/shipment';

function getCurrentBatch(batchId: string, order: Object): ?Object {
  return order.orderItems
    .map(oi => oi.batches)
    .flat()
    .find(oi => oi.id === batchId);
}

function getShipmentTransportType(batchId: string, order: Object): ?string {
  const currentBatch = getCurrentBatch(batchId, order);
  return currentBatch?.shipment?.transportType ?? null;
}

function transformOrder(basePath: string, order: Object): Array<CellValue> {
  return [
    {
      columnKey: 'order.created',
      type: 'date_user',
      ...transformComputedField(basePath, order, item => ({
        at: new Date(item.createdAt),
        by: item.createdBy,
      })),
    },
    {
      columnKey: 'order.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, order, 'createdBy', order?.createdBy ?? null),
    },
    {
      columnKey: 'order.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, order, 'createdAt', order?.createdAt ?? null),
    },
    {
      columnKey: 'order.updated',
      type: 'date_user',
      ...transformComputedField(basePath, order, item => ({
        at: new Date(item.updatedAt),
        by: item.updatedBy,
      })),
    },
    {
      columnKey: 'order.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, order, 'updatedBy', order?.updatedBy ?? null),
    },
    {
      columnKey: 'order.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, order, 'updatedAt', order?.updatedAt ?? null),
    },
    {
      columnKey: 'order.archived',
      type: 'status',
      ...transformValueField(
        basePath,
        order,
        'archived',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_ARCHIVED)
      ),
    },
    {
      columnKey: 'order.poNo',
      type: 'text',
      ...transformValueField(
        basePath,
        order,
        'poNo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_PO_NO)
      ),
    },
    {
      columnKey: 'order.inCharges',
      type: 'user_assignment',
      computed: item => [item.importer?.id, item.exporter?.id].filter(Boolean),
      ...transformValueField(
        basePath,
        order,
        'inCharges',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_IN_CHARGES)
      ),
    },
    {
      columnKey: 'order.importer',
      type: 'partner',
      ...transformReadonlyField(basePath, order, 'importer', order?.importer ?? null),
    },
    {
      columnKey: 'order.exporter',
      type: 'exporter_selector',
      extra: {
        confirmationDialogMessage: <FormattedMessage id="modules.Orders.changeExporterWarning" />,
        isRequired: true,
      },
      ...transformValueField(
        basePath,
        order,
        'exporter',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_EXPORTER)
      ),
    },
    {
      columnKey: 'order.piNo',
      type: 'text',
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
      ...transformValueField(
        basePath,
        order,
        'deliveryPlace',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_DELIVERY_PLACE)
      ),
    },
    {
      columnKey: 'order.tags',
      type: 'order_tags',
      ...transformValueField(
        basePath,
        order,
        'tags',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_TASK_SET_TAGS)
      ),
    },
    {
      columnKey: 'order.memo',
      type: 'textarea',
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
      ...transformComputedField(basePath, order, item =>
        item.orderItems.reduce((total, orderItem) => total + orderItem.quantity, 0)
      ),
    },
    {
      columnKey: 'order.totalBatched',
      type: 'number',
      ...transformComputedField(basePath, order, item =>
        item.orderItems.reduce(
          (totalBatched, orderItem) =>
            totalBatched + orderItem.batches.reduce((total, batch) => batch.quantity + total, 0),
          0
        )
      ),
    },
    {
      columnKey: 'order.totalShipped',
      type: 'number',
      ...transformComputedField(basePath, order, item =>
        item.orderItems.reduce(
          (totalBatched, orderItem) =>
            totalBatched +
            orderItem.batches
              .filter(batch => !!batch.shipment)
              .reduce((total, batch) => batch.quantity + total, 0),
          0
        )
      ),
    },
    {
      columnKey: 'order.files',
      type: 'order_documents',
      ...transformValueField(
        basePath,
        order,
        'files',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_DOCUMENTS)
      ),
    },
    {
      columnKey: 'order.logs',
      type: 'order_logs',
      ...transformValueField(basePath, order, 'id', () => true),
    },
  ].map(c => ({
    ...c,
    empty: !order,
    parent: true,
  }));
}

function transformOrderItem(
  basePath: string,
  orderItem: Object,
  hasItems: boolean
): Array<CellValue> {
  return [
    {
      columnKey: 'order.orderItem.created',
      type: 'date_user',
      ...transformComputedField(basePath, orderItem, item => {
        const currentOrderItem = item.orderItems.find(oi => oi.id === orderItem?.id);
        return currentOrderItem
          ? {
              at: new Date(currentOrderItem.createdAt),
              by: currentOrderItem.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.orderItem.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'createdBy', orderItem?.createdBy ?? null),
    },
    {
      columnKey: 'order.orderItem.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'createdAt', orderItem?.createdAt ?? null),
    },
    {
      columnKey: 'order.orderItem.updated',
      type: 'date_user',
      ...transformComputedField(basePath, orderItem, item => {
        const currentOrderItem = item.orderItems.find(oi => oi.id === orderItem?.id);
        return currentOrderItem
          ? {
              at: new Date(currentOrderItem.updatedAt),
              by: currentOrderItem.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.orderItem.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'updatedBy', orderItem?.updatedBy ?? null),
    },
    {
      columnKey: 'order.orderItem.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'updatedAt', orderItem?.updatedAt ?? null),
    },
    {
      columnKey: 'order.orderItem.productProvider.product.name',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.productProvider.product`,
        orderItem?.productProvider?.product ?? null,
        'name',
        orderItem?.productProvider?.product?.name ?? ''
      ),
    },
    {
      columnKey: 'order.orderItem.productProvider.product.serial',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.productProvider.product`,
        orderItem?.productProvider?.product ?? null,
        'serial',
        orderItem?.productProvider?.product?.serial ?? ''
      ),
    },
    {
      columnKey: 'order.orderItem.archived',
      type: 'status',
      ...transformComputedField(basePath, orderItem, order => order.archived),
    },
    {
      columnKey: 'order.orderItem.no',
      type: 'text',
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
      type: 'static_metric_value',
      ...transformValueField(
        basePath,
        orderItem,
        'price',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_PRICE)
      ),
    },
    {
      columnKey: 'order.orderItem.tags',
      type: 'order_item_tags',
      ...transformValueField(
        basePath,
        orderItem,
        'tags',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_TAGS)
      ),
    },
    {
      columnKey: 'order.orderItem.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        orderItem,
        'memo',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_MEMO)
      ),
    },
    {
      columnKey: 'order.orderItem.totalBatched',
      type: 'number',
      ...transformComputedField(basePath, orderItem, item => {
        const currentOrderItem = item.orderItems.find(oi => oi.id === orderItem?.id);
        // $FlowFixMe: Flow does not yet support method or property calls in optional chains.
        return currentOrderItem?.batches.reduce((total, batch) => total + batch.quantity, 0) ?? 0;
      }),
    },
    {
      columnKey: 'order.orderItem.totalBatched',
      type: 'number',
      ...transformComputedField(basePath, orderItem, item => {
        const currentOrderItem = item.orderItems.find(oi => oi.id === orderItem?.id);
        return (
          // $FlowFixMe: Flow does not yet support method or property calls in optional chains.
          currentOrderItem?.batches
            .filter(batch => !!batch.shipment)
            .reduce((total, batch) => total + batch.quantity, 0) ?? 0
        );
      }),
    },
    {
      columnKey: 'order.orderItem.deliveryDate',
      type: 'date',
      ...transformValueField(
        basePath,
        orderItem,
        'deliveryDate',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.files',
      type: 'order_item_documents',
      ...transformValueField(
        basePath,
        orderItem,
        'files',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_DOCUMENTS)
      ),
    },
    {
      columnKey: 'order.orderItem.logs',
      type: 'order_item_logs',
      ...transformValueField(basePath, orderItem, 'id', () => true),
    },
  ].map(c => ({
    ...c,
    disabled: !hasItems && !orderItem,
    empty: hasItems && !orderItem,
    parent: true,
  }));
}

function transformBatch(basePath: string, batch: Object): Array<CellValue> {
  return [
    {
      columnKey: 'order.orderItem.batch.created',
      type: 'date_user',
      ...transformComputedField(basePath, batch, item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return currentBatch
          ? {
              at: new Date(currentBatch.createdAt),
              by: currentBatch.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'createdBy', batch?.createdBy ?? null),
    },
    {
      columnKey: 'order.orderItem.batch.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'createdAt', batch?.createdAt ?? null),
    },
    {
      columnKey: 'order.orderItem.batch.updated',
      type: 'date_user',
      ...transformComputedField(basePath, batch, item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return currentBatch
          ? {
              at: new Date(currentBatch.updatedAt),
              by: currentBatch.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'updatedBy', batch?.updatedBy ?? null),
    },
    {
      columnKey: 'order.orderItem.batch.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'updatedAt', batch?.updatedAt ?? null),
    },
    {
      columnKey: 'order.orderItem.batch.archived',
      type: 'status',
      ...transformComputedField(basePath, batch, order => {
        const currentBatch = order.orderItems
          .map(oi => oi.batches)
          .flat()
          .find(oi => oi.id === batch?.id);

        if (currentBatch?.shipment) {
          return order.archived && currentBatch?.shipment?.archived;
        }
        return order.archived;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.no',
      type: 'text',
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
      ...transformValueField(
        basePath,
        batch,
        'producedAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PRODUCTION_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.tags',
      type: 'batch_tags',
      ...transformValueField(
        basePath,
        batch,
        'tags',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_TAGS)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        batch,
        'memo',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_MEMO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.quantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'quantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.quantityRevisions',
      type: 'quantity_revisions',
      ...transformValueField(
        basePath,
        batch,
        'batchQuantityRevisions',
        hasPermission =>
          hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY_ADJUSTMENTS)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.packageName',
      type: 'text',
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
      ...transformValueField(
        basePath,
        batch,
        'packageCapacity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_CAPACITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.packageQuantity',
      type: 'number_toggle',
      computed: order => {
        const currentBatch = getCurrentBatch(batch?.id, order);
        const latestQuantity = getBatchLatestQuantity(currentBatch);
        const packageCapacity = currentBatch?.packageCapacity ?? 0;
        return packageCapacity ? latestQuantity / packageCapacity : 0;
      },
      ...transformValueField(
        basePath,
        batch,
        'packageQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_QUANTITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.logs',
      type: 'batch_logs',
      ...transformValueField(basePath, batch, 'id', () => true),
    },
  ].map(c => ({
    ...c,
    disabled: !batch,
  }));
}

function transformBatchContainer(basePath: string, batch: Object): Array<CellValue> {
  return [
    {
      columnKey: 'order.orderItem.batch.container.created',
      type: 'date_user',
      ...transformComputedField(`${basePath}.container`, batch?.container ?? null, item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return currentBatch?.container
          ? {
              at: new Date(currentBatch?.container.createdAt ?? ''),
              by: currentBatch?.container.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.container.createdBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'createdBy',
        batch?.container?.createdBy ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.createdAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'createdAt',
        batch?.container?.createdAt ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.updated',
      type: 'date_user',
      ...transformComputedField(`${basePath}.container`, batch?.container ?? null, item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return currentBatch?.container
          ? {
              at: new Date(currentBatch?.container.updatedAt ?? ''),
              by: currentBatch?.container.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.container.updatedBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'updatedBy',
        batch?.container?.updatedBy ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.updatedAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'updatedAt',
        batch?.container?.updatedAt ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.archived',
      type: 'status',
      ...transformComputedField(`${basePath}.container`, batch?.container ?? null, item => {
        const currentBatch = getCurrentBatch(batch?.id, item);

        return currentBatch?.shipment?.archived ?? true;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.container.no',
      type: 'text',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'no',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.containerType',
      type: 'container_type',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'containerType',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_CONTAINER_TYPE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.containerOption',
      type: 'container_option',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'containerOption',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_CONTAINER_OPTION)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.warehouseArrivalAgreedDate',
      type: 'datetime',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'warehouseArrivalAgreedDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_AGREE_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.warehouseArrivalAgreedDateAssignedTo',
      type: 'user_assignment',
      computed: item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'warehouseArrivalAgreedDateAssignedTo',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_ASSIGN_AGREE_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.warehouseArrivalActualDate',
      type: 'datetime',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'warehouseArrivalActualDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_ACTUAL_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.warehouseArrivalActualDateAssignedTo',
      type: 'user_assignment',
      computed: item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'warehouseArrivalActualDateAssignedTo',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_ASSIGN_ACTUAL_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.freeTimeStartDate',
      type: 'date_toggle',
      computed: order => {
        const currentBatch = getCurrentBatch(batch?.id, order);
        const auto = currentBatch?.container?.autoCalculatedFreeTimeStartDate ?? false;
        const voyages = currentBatch?.shipment?.voyages ?? [];
        return auto ? getLatestDate(voyages?.[voyages.length - 1]?.arrival) : null;
      },
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'freeTimeStartDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_FREE_TIME_START_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.dueDate',
      type: 'date',
      ...transformComputedField(`${basePath}.container`, batch?.container ?? null, item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        const date = currentBatch?.container?.freeTimeStartDate;
        return date ? addDays(date, currentBatch?.container?.freeTimeDuration ?? 0) : null;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.container.yardName',
      type: 'text',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'yardName',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_YARD_NAME)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.departureDate',
      type: 'date',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'departureDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_DEPARTURE_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.departureDateAssignedTo',
      type: 'user_assignment',
      computed: item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'departureDateAssignedTo',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_ASSIGN_DEPARTURE_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.tags',
      type: 'container_tags',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'tags',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_TAGS)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.memo',
      type: 'textarea',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'memo',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_MEMO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.container.logs',
      type: 'container_logs',
      ...transformValueField(`${basePath}.container`, batch?.container ?? null, 'id', () => true),
    },
  ].map(c => ({
    ...c,
    duplicatable: true,
    disabled: !(batch?.container ?? null),
  }));
}

function transformBatchShipment(basePath: string, batch: Object): Array<CellValue> {
  return [
    {
      columnKey: 'order.orderItem.batch.shipment.created',
      type: 'date_user',
      ...transformComputedField(`${basePath}.shipment`, batch?.shipment ?? null, item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return currentBatch?.shipment
          ? {
              at: new Date(currentBatch?.shipment.createdAt ?? ''),
              by: currentBatch?.shipment.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.createdBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'createdBy',
        batch?.shipment?.createdBy ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.createdAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'createdAt',
        batch?.shipment?.createdAt ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.updated',
      type: 'date_user',
      ...transformComputedField(`${basePath}.shipment`, batch?.shipment ?? null, item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return currentBatch?.shipment
          ? {
              at: new Date(currentBatch?.shipment.updatedAt ?? ''),
              by: currentBatch?.shipment.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.updatedBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'updatedBy',
        batch?.shipment?.updatedBy ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.updatedAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'updatedAt',
        batch?.shipment?.updatedAt ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.archived',
      type: 'status',
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'archived',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_ARCHIVED)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.no',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'no',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.importer',
      type: 'partner',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'importer',
        batch?.shipment?.importer ?? null
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.inCharges',
      type: 'user_assignment',
      computed: item => {
        const currentBatch = getCurrentBatch(batch?.id, item);
        return [
          currentBatch?.shipment?.importer?.id,
          currentBatch?.shipment?.exporter?.id,
          // $FlowFixMe: Flow does not yet support method or property calls in optional chains.
          ...currentBatch?.shipment?.forwarders?.map(f => f.id),
        ].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'inCharges',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_IN_CHARGE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.forwarders',
      type: 'forwarders',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'forwarders',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_FORWARDERS)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.blNo',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'blNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.blDate',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'blDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.bookingNo',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'bookingNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.booked',
      type: 'booked',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'booked',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKED)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.bookingDate',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'bookingDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.invoiceNo',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'invoiceNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INVOICE_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.contractNo',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'contractNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CONTRACT_NO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.transportType',
      type: 'transport_type',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'transportType',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TRANSPORT_TYPE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.loadType',
      type: 'load_type',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'loadType',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_LOAD_TYPE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.incoterm',
      type: 'incoterm',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'incoterm',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INCOTERM)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.carrier',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'carrier',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CARRIER)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.tags',
      type: 'shipment_tags',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'tags',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TAGS)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.memo',
      type: 'textarea',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'memo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_MEMO)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.cargoReady.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.cargoReady`,
        batch?.shipment?.cargoReady ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.cargoReady.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.cargoReady`,
        batch?.shipment?.cargoReady ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    // Cargo Ready Assigned To
    // Cargo Ready Approval
    {
      columnKey: 'order.orderItem.batch.shipment.voyage.0.departurePort',
      type: 'port',
      computed: item => getShipmentTransportType(batch?.id, item),
      ...transformValueField(
        `${basePath}.shipment.voyages.0`,
        batch?.shipment?.voyages?.[0] ?? null,
        'departurePort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.voyage.0.departure.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.voyages.0.departure`,
        batch?.shipment?.voyages?.[0]?.departure ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.voyage.0.departure.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.voyages.0.departure`,
        batch?.shipment?.voyages?.[0]?.departure ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    // Load Port Departure Assigned To
    // Load Port Departure Approval
    // First Voyage Vessel Name
    // First Voyage Vessel Code
    // First Transit Port
    // First Transit Port Arrival Initial Date
    // First Transit Port Arrival Date Revisions
    // First Transit Port Arrival Assigned To
    // First Transit Port Arrival Approval
    // First Transit Port Departure Initial Date
    // First Transit Port Departure Date Revisions
    // First Transit Port Departure Assigned To
    // First Transit Port Departure Approval
    // Second Voyage Vessel Name
    // Second Voyage Vessel Code
    // Second Transit Port
    // Second Transit Port Arrival Initial Date
    // Second Transit Port Arrival Date Revisions
    // Second Transit Port Arrival  Assigned To
    // Second Transit Port Arrival Approval
    // Second Transit Port Departure Initial Date
    // Second Transit Port Departure Date Revisions
    // Second Transit Port Departure Assigned To
    // Second Transit Port Departure Approval
    // Third Voyage Vessel Name
    // Third Voyage Vessel Code
    {
      columnKey: 'order.orderItem.batch.shipment.voyage.2.arrivalPort',
      type: 'port',
      computed: item => getShipmentTransportType(batch?.id, item),
      ...transformValueField(
        `${basePath}.shipment.voyages.${(batch?.shipment?.voyages?.length ?? 0) - 1}`,
        batch?.shipment?.voyages?.[(batch?.shipment?.voyages?.length ?? 0) - 1] ?? null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.voyage.2.arrival.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.voyages.${(batch?.shipment?.voyages?.length ?? 0) - 1}.arrival`,
        batch?.shipment?.voyages?.[(batch?.shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.voyage.2.arrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.voyages.${(batch?.shipment?.voyages?.length ?? 0) - 1}.arrival`,
        batch?.shipment?.voyages?.[(batch?.shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    // Discharge Port Arrival Assigned To
    // Discharge Port Arrival Approval
    {
      columnKey: 'order.orderItem.batch.shipment.containerGroup.customClearance.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.customClearance`,
        batch?.shipment?.containerGroups?.[0]?.customClearance ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey:
        'order.orderItem.batch.shipment.containerGroup.customClearance.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.customClearance`,
        batch?.shipment?.containerGroups?.[0]?.customClearance ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.containerGroup.warehouseArrival.date',
      type: 'date',
      ...(batch?.shipment?.containerCount
        ? {
            entity: null,
            data: null,
            forbidden: false,
          }
        : transformValueField(
            `${basePath}.shipment.containerGroups.0.warehouseArrival`,
            batch?.shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
            'date',
            hasPermission =>
              hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
          )),
    },
    {
      columnKey:
        'order.orderItem.batch.shipment.containerGroup.warehouseArrival.timelineDateRevisions',
      type: 'date_revisions',
      ...(batch?.shipment?.containerCount
        ? { entity: null, data: null, forbidden: false }
        : transformValueField(
            `${basePath}.shipment.containerGroups.0.warehouseArrival`,
            batch?.shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
            'timelineDateRevisions',
            hasPermission =>
              hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
          )),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.containerGroup.deliveryReady.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.deliveryReady`,
        batch?.shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey:
        'order.orderItem.batch.shipment.containerGroup.deliveryReady.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.deliveryReady`,
        batch?.shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.files',
      type: 'shipment_documents',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'files',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_DOCUMENTS)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shipment.logs',
      type: 'shipment_logs',
      ...transformValueField(`${basePath}.shipment`, batch?.shipment ?? null, 'id', () => true),
    },
  ].map(c => ({
    ...c,
    duplicatable: true,
    disabled: !(batch?.shipment ?? null),
  }));
}

function transformFullBatch(basePath: string, batch: Object): Array<CellValue> {
  return [
    ...transformBatch(basePath, batch),
    ...transformBatchContainer(basePath, batch),
    ...transformBatchShipment(basePath, batch),
  ];
}

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
            ...transformFullBatch(`${index}.orderItems.${orderItemIdx}.batches.${batchIdx}`, batch),
          ]);
          orderCells = transformOrder(`${index}`, null);
          orderItemCells = transformOrderItem(`${index}.orderItems.${orderItemIdx}`, null, true);
        });
      } else {
        rows.push([
          ...orderCells,
          ...transformOrderItem(`${index}.orderItems.${orderItemIdx}`, orderItem, true),
          ...transformFullBatch(`${index}.orderItems.${orderItemIdx}.batches.0`, null),
        ]);
        orderCells = transformOrder(`${index}`, null);
      }
    });
  } else {
    rows.push([
      ...orderCells,
      ...transformOrderItem(`${index}.orderItems.0`, null, false),
      ...transformFullBatch(`${index}.orderItems.0.batches.0`, null),
    ]);
  }

  return rows;
}
