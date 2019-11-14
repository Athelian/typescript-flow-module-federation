// @flow
import type { Batch } from 'generated/graphql';
import { addDays } from 'date-fns';
import { calculateVolume, getBatchLatestQuantity } from 'utils/batch';
import { getLatestDate } from 'utils/shipment';
import { defaultVolumeMetric } from 'utils/metric';
import type { FieldDefinition } from 'types';
import { startOfToday, differenceInCalendarDays, calculateDueDate } from 'utils/date';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  transformComputedField,
  transformReadonlyField,
  transformCustomField,
  transformValueField,
  transformField,
} from 'components/Sheet';
import {
  ORDER_SET_ARCHIVED,
  ORDER_SET_CURRENCY,
  ORDER_SET_CUSTOM_FIELDS,
  ORDER_SET_CUSTOM_FIELDS_MASK,
  ORDER_SET_DELIVERY_DATE,
  ORDER_SET_DELIVERY_PLACE,
  ORDER_SET_DOCUMENTS,
  ORDER_SET_IN_CHARGES,
  ORDER_SET_INCOTERM,
  ORDER_SET_ISSUE_AT,
  ORDER_SET_MEMO,
  ORDER_SET_PI_NO,
  ORDER_SET_PO_NO,
  ORDER_SET_TAGS,
  ORDER_SET_TASKS,
  ORDER_UPDATE,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_SET_CUSTOM_FIELDS,
  ORDER_ITEMS_SET_CUSTOM_FIELDS_MASK,
  ORDER_ITEMS_SET_DELIVERY_DATE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_SET_MEMO,
  ORDER_ITEMS_SET_NO,
  ORDER_ITEMS_SET_PRICE,
  ORDER_ITEMS_SET_QUANTITY,
  ORDER_ITEMS_SET_TAGS,
  ORDER_ITEMS_SET_TASKS,
  ORDER_ITEMS_UPDATE,
} from 'modules/permission/constants/orderItem';
import {
  BATCH_SET_CUSTOM_FIELDS,
  BATCH_SET_CUSTOM_FIELDS_MASK,
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_EXPIRY,
  BATCH_SET_MEMO,
  BATCH_SET_NO,
  BATCH_SET_PACKAGE_CAPACITY,
  BATCH_SET_PACKAGE_NAME,
  BATCH_SET_PACKAGE_QUANTITY,
  BATCH_SET_PACKAGE_SIZE,
  BATCH_SET_PACKAGE_VOLUME,
  BATCH_SET_PACKAGE_WEIGHT,
  BATCH_SET_PRODUCTION_DATE,
  BATCH_SET_QUANTITY,
  BATCH_SET_TAGS,
  BATCH_SET_TASKS,
  BATCH_UPDATE,
} from 'modules/permission/constants/batch';
import {
  CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
  CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
  CONTAINER_APPROVE_DEPARTURE_DATE,
  CONTAINER_ASSIGN_ACTUAL_ARRIVAL_DATE,
  CONTAINER_ASSIGN_AGREE_ARRIVAL_DATE,
  CONTAINER_ASSIGN_DEPARTURE_DATE,
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_CONTAINER_OPTION,
  CONTAINER_SET_CONTAINER_TYPE,
  CONTAINER_SET_DEPARTURE_DATE,
  CONTAINER_SET_FREE_TIME_DURATION,
  CONTAINER_SET_FREE_TIME_START_DATE,
  CONTAINER_SET_MEMO,
  CONTAINER_SET_NO,
  CONTAINER_SET_TAGS,
  CONTAINER_SET_WAREHOUSE,
  CONTAINER_SET_YARD_NAME,
  CONTAINER_UPDATE,
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
  SHIPMENT_SET_FORWARDERS,
  SHIPMENT_SET_IN_CHARGE,
  SHIPMENT_SET_INCOTERM,
  SHIPMENT_SET_INVOICE_NO,
  SHIPMENT_SET_LOAD_TYPE,
  SHIPMENT_SET_MEMO,
  SHIPMENT_SET_NO,
  SHIPMENT_SET_PORT,
  SHIPMENT_SET_REVISE_TIMELINE_DATE,
  SHIPMENT_SET_TAGS,
  SHIPMENT_SET_TASKS,
  SHIPMENT_SET_TIMELINE_DATE,
  SHIPMENT_SET_TRANSPORT_TYPE,
  SHIPMENT_SET_VESSEL_NAME,
  SHIPMENT_SET_WAREHOUSE,
  SHIPMENT_ASSIGN_TIMELINE_DATE,
  SHIPMENT_APPROVE_TIMELINE_DATE,
  SHIPMENT_UPDATE,
  SHIPMENT_SET_CUSTOM_FIELDS,
  SHIPMENT_SET_CUSTOM_FIELDS_MASK,
} from 'modules/permission/constants/shipment';

function transformBatch(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Batch
): Array<CellValue> {
  return [
    {
      columnKey: 'batch.created',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'created', currentBatch => {
        return currentBatch
          ? {
              at: new Date(currentBatch.createdAt),
              by: currentBatch.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'batch.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'createdBy', batch?.createdBy ?? null),
    },
    {
      columnKey: 'batch.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'createdAt', batch?.createdAt ?? null),
    },
    {
      columnKey: 'batch.updated',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'updated', currentBatch => {
        return currentBatch
          ? {
              at: new Date(currentBatch.updatedAt),
              by: currentBatch.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'batch.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'updatedBy', batch?.updatedBy ?? null),
    },
    {
      columnKey: 'batch.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'updatedAt', batch?.updatedAt ?? null),
    },
    {
      columnKey: 'batch.archived',
      type: 'status',
      ...transformComputedField(basePath, batch, 'archived', currentBatch => {
        if (currentBatch?.shipment) {
          return currentBatch?.orderItem?.order?.archived && currentBatch?.shipment?.archived;
        }
        return currentBatch?.orderItem?.order?.archived;
      }),
    },
    {
      columnKey: 'batch.no',
      type: 'text',
      ...transformValueField(
        basePath,
        batch,
        'no',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_NO)
      ),
    },
    {
      columnKey: 'batch.deliveredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'deliveredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'batch.desiredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'desiredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_DESIRED_DATE)
      ),
    },
    {
      columnKey: 'batch.expiredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'expiredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_EXPIRY)
      ),
    },
    {
      columnKey: 'batch.producedAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'producedAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PRODUCTION_DATE)
      ),
    },
    {
      columnKey: 'batch.tags',
      type: 'batch_tags',
      ...transformValueField(
        basePath,
        batch,
        'tags',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_TAGS)
      ),
    },
    {
      columnKey: 'batch.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        batch,
        'memo',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_MEMO)
      ),
    },
    {
      columnKey: 'batch.latestQuantity',
      type: 'number',
      ...transformComputedField(basePath, batch, 'latestQuantity', currentBatch => {
        return getBatchLatestQuantity(currentBatch);
      }),
    },
    {
      columnKey: 'batch.quantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'quantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'batch.packageName',
      type: 'text',
      ...transformValueField(
        basePath,
        batch,
        'packageName',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_NAME)
      ),
    },
    {
      columnKey: 'batch.packageCapacity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'packageCapacity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_CAPACITY)
      ),
    },
    {
      columnKey: 'batch.packageQuantity',
      type: 'number_toggle',
      computed: currentBatch => {
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
      columnKey: 'batch.packageGrossWeight',
      type: 'mass',
      ...transformValueField(
        basePath,
        batch,
        'packageGrossWeight',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_WEIGHT)
      ),
    },
    {
      columnKey: 'batch.packageVolume',
      type: 'volume_toggle',
      computed: currentBatch => {
        return calculateVolume(
          currentBatch?.packageVolume?.value ?? { value: 0, metric: defaultVolumeMetric },
          currentBatch?.packageSize
        );
      },
      ...transformValueField(
        basePath,
        batch,
        'packageVolume',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_VOLUME)
      ),
    },
    {
      columnKey: 'batch.packageSize',
      type: 'size',
      ...transformValueField(
        basePath,
        batch,
        'packageSize',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_SIZE)
      ),
    },
    {
      columnKey: 'batch.todo',
      type: 'batch_tasks',
      computed: item => ({
        entityId: batch?.id,
        ownerId: batch?.ownedBy?.id,
        groupIds: [item.importer?.id, item.exporter?.id].filter(Boolean),
      }),
      ...transformValueField(
        basePath,
        batch,
        'todo',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_TASKS)
      ),
    },
    {
      columnKey: 'batch.logs',
      type: 'batch_logs',
      ...transformValueField(basePath, batch, 'id', () => true),
    },
    {
      columnKey: 'batch.mask',
      type: 'mask',
      extra: { entityType: 'Batch' },
      ...transformField(
        batch,
        `${basePath}.customFields.mask`,
        'mask',
        batch?.customFields?.mask ?? null,
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `batch.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: currentBatch => {
        const mask = currentBatch?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        batch,
        fieldDefinition.id,
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_CUSTOM_FIELDS)
      ),
    })),
  ];
}

function transformOrderItem(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  orderItem: Object
): Array<CellValue> {
  return [
    {
      columnKey: 'orderItem.created',
      type: 'date_user',
      ...transformComputedField(basePath, orderItem, 'created', batch => {
        const currentOrderItem = batch.orderItem;
        return currentOrderItem
          ? {
              at: new Date(currentOrderItem.createdAt),
              by: currentOrderItem.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'orderItem.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'createdBy', orderItem?.createdBy ?? null),
    },
    {
      columnKey: 'orderItem.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'createdAt', orderItem?.createdAt ?? null),
    },
    {
      columnKey: 'orderItem.updated',
      type: 'date_user',
      ...transformComputedField(basePath, orderItem, 'updated', batch => {
        const currentOrderItem = batch.orderItem;
        return currentOrderItem
          ? {
              at: new Date(currentOrderItem.updatedAt),
              by: currentOrderItem.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'orderItem.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'updatedBy', orderItem?.updatedBy ?? null),
    },
    {
      columnKey: 'orderItem.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, orderItem, 'updatedAt', orderItem?.updatedAt ?? null),
    },
    {
      columnKey: 'orderItem.productProvider.product.name',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.productProvider.product`,
        orderItem?.productProvider?.product ?? null,
        'name',
        orderItem?.productProvider?.product?.name ?? ''
      ),
    },
    {
      columnKey: 'orderItem.productProvider.product.serial',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.productProvider.product`,
        orderItem?.productProvider?.product ?? null,
        'serial',
        orderItem?.productProvider?.product?.serial ?? ''
      ),
    },
    {
      columnKey: 'orderItem.archived',
      type: 'status',
      ...transformComputedField(basePath, orderItem, 'archived', order => order.archived),
    },
    {
      columnKey: 'orderItem.no',
      type: 'text',
      ...transformValueField(
        basePath,
        orderItem,
        'no',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_NO)
      ),
    },
    {
      columnKey: 'orderItem.quantity',
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
      columnKey: 'orderItem.price',
      type: 'static_metric_value',
      ...transformValueField(
        basePath,
        orderItem,
        'price',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_PRICE)
      ),
    },
    {
      columnKey: 'orderItem.deliveryDate',
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
      columnKey: 'orderItem.tags',
      type: 'order_item_tags',
      ...transformValueField(
        basePath,
        orderItem,
        'tags',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_TAGS)
      ),
    },
    {
      columnKey: 'orderItem.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        orderItem,
        'memo',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_MEMO)
      ),
    },
    {
      columnKey: 'orderItem.files',
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
      columnKey: 'orderItem.todo',
      type: 'order_item_tasks',
      computed: item => ({
        entityId: orderItem?.id,
        ownerId: orderItem.ownedBy?.id,
        groupIds: [item.importer?.id, item.exporter?.id].filter(Boolean),
      }),
      ...transformValueField(
        basePath,
        orderItem,
        'todo',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_TASKS)
      ),
    },
    {
      columnKey: 'orderItem.logs',
      type: 'order_item_logs',
      ...transformValueField(basePath, orderItem, 'id', () => true),
    },
    {
      columnKey: 'orderItem.mask',
      type: 'mask',
      extra: { entityType: 'OrderItem' },
      ...transformField(
        orderItem,
        `${basePath}.customFields.mask`,
        'mask',
        orderItem?.customFields?.mask ?? null,
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `orderItem.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: currentBatch => {
        const mask = currentBatch?.orderItem?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        orderItem,
        fieldDefinition.id,
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_CUSTOM_FIELDS)
      ),
    })),
  ].map(c => ({
    ...c,
    duplicable: true,
  }));
}

function transformOrder(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  order: Object
): Array<CellValue> {
  return [
    {
      columnKey: 'order.created',
      type: 'date_user',
      ...transformComputedField(basePath, order, 'created', () => ({
        at: new Date(order.createdAt),
        by: order.createdBy,
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
      ...transformComputedField(basePath, order, 'updated', item => ({
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
      computed: () => [order.importer?.id, order.exporter?.id].filter(Boolean),
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
      type: 'partner',
      ...transformReadonlyField(basePath, order, 'exporter', order?.exporter ?? null),
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
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_TAGS)
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
      columnKey: 'order.todo',
      type: 'order_tasks',
      computed: item => ({
        entityId: item.id,
        ownerId: item.ownedBy?.id,
        groupIds: [item.importer?.id, item.exporter?.id].filter(Boolean),
      }),
      ...transformValueField(
        basePath,
        order,
        'todo',
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_TASKS)
      ),
    },
    {
      columnKey: 'order.logs',
      type: 'order_logs',
      ...transformValueField(basePath, order, 'id', () => true),
    },
    {
      columnKey: 'order.mask',
      type: 'mask',
      extra: { entityType: 'Order' },
      ...transformField(
        order,
        `${basePath}.customFields.mask`,
        'mask',
        order?.customFields?.mask ?? null,
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `order.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: currentBatch => {
        const mask = currentBatch?.orderItem?.order?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        order,
        fieldDefinition.id,
        hasPermission => hasPermission(ORDER_UPDATE) || hasPermission(ORDER_SET_CUSTOM_FIELDS)
      ),
    })),
  ].map(c => ({
    ...c,
    duplicable: true,
  }));
}

function transformContainer(basePath: string, batch: Batch): Array<CellValue> {
  return [
    {
      columnKey: 'container.created',
      type: 'date_user',
      ...transformComputedField(
        `${basePath}.container`,
        batch?.container ?? null,
        'created',
        currentBatch => {
          return currentBatch?.container
            ? {
                at: new Date(currentBatch?.container.createdAt ?? ''),
                by: currentBatch?.container.createdBy,
              }
            : null;
        }
      ),
    },
    {
      columnKey: 'container.createdBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'createdBy',
        batch?.container?.createdBy ?? null
      ),
    },
    {
      columnKey: 'container.createdAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'createdAt',
        batch?.container?.createdAt ?? null
      ),
    },
    {
      columnKey: 'container.updated',
      type: 'date_user',
      ...transformComputedField(
        `${basePath}.container`,
        batch?.container ?? null,
        'updated',
        currentBatch => {
          return currentBatch?.container
            ? {
                at: new Date(currentBatch?.container.updatedAt ?? ''),
                by: currentBatch?.container.updatedBy,
              }
            : null;
        }
      ),
    },
    {
      columnKey: 'container.updatedBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'updatedBy',
        batch?.container?.updatedBy ?? null
      ),
    },
    {
      columnKey: 'container.updatedAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.container`,
        batch?.container ?? null,
        'updatedAt',
        batch?.container?.updatedAt ?? null
      ),
    },
    {
      columnKey: 'container.archived',
      type: 'status',
      ...transformComputedField(
        `${basePath}.container`,
        batch?.container ?? null,
        'archived',
        currentBatch => {
          return currentBatch?.shipment?.archived ?? true;
        }
      ),
    },
    {
      columnKey: 'container.no',
      type: 'text',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'no',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_NO)
      ),
    },
    {
      columnKey: 'container.containerType',
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
      columnKey: 'container.containerOption',
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
      columnKey: 'container.warehouseArrivalAgreedDate',
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
      columnKey: 'container.warehouseArrivalAgreedDateAssignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [
          currentBatch?.shipment?.importer?.id,
          currentBatch?.shipment?.exporter?.id,
          ...(currentBatch?.shipment?.forwarders ?? []).map(f => f.id),
        ].filter(Boolean);
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
      columnKey: 'container.warehouseArrivalAgreedDateApproved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'warehouseArrivalAgreedDateApproved',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_APPROVE_AGREE_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'container.warehouseArrivalActualDate',
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
      columnKey: 'container.warehouseArrivalActualDateAssignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [
          currentBatch?.shipment?.importer?.id,
          currentBatch?.shipment?.exporter?.id,
          ...(currentBatch?.shipment?.forwarders ?? []).map(f => f.id),
        ].filter(Boolean);
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
      columnKey: 'container.warehouseArrivalActualDateApproved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'warehouseArrivalActualDateApproved',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'container.warehouse',
      type: 'warehouse',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'warehouse',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_WAREHOUSE)
      ),
    },
    {
      columnKey: 'container.freeTime',
      type: 'text',
      ...transformComputedField(
        `${basePath}.container`,
        batch?.container ?? null,
        'freeTime',
        currentBatch => {
          const { value: freeTimeStartDate } = currentBatch?.container?.freeTimeStartDate ?? {
            value: null,
          };
          const dueDate = freeTimeStartDate
            ? calculateDueDate(freeTimeStartDate, currentBatch?.container?.freeTimeDuration ?? 0)
            : null;

          return dueDate ? differenceInCalendarDays(dueDate, startOfToday()) : 0;
        }
      ),
    },
    {
      columnKey: 'container.freeTimeStartDate',
      type: 'date_toggle',
      computed: currentBatch => {
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
      columnKey: 'container.freeTimeDuration',
      type: 'day',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'freeTimeDuration',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_FREE_TIME_DURATION)
      ),
    },
    {
      columnKey: 'container.dueDate',
      type: 'date',
      ...transformComputedField(
        `${basePath}.container`,
        batch?.container ?? null,
        'dueDate',
        currentBatch => {
          const date = currentBatch?.container?.freeTimeStartDate?.value;
          return date
            ? addDays(new Date(date), currentBatch?.container?.freeTimeDuration ?? 0)
            : null;
        }
      ),
    },
    {
      columnKey: 'container.yardName',
      type: 'text',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'yardName',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_YARD_NAME)
      ),
    },
    {
      columnKey: 'container.departureDate',
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
      columnKey: 'container.departureDateAssignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
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
      columnKey: 'container.departureDateApproved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'departureDateApproved',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_APPROVE_DEPARTURE_DATE)
      ),
    },
    {
      columnKey: 'container.tags',
      type: 'container_tags',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'tags',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_TAGS)
      ),
    },
    {
      columnKey: 'container.memo',
      type: 'textarea',
      ...transformValueField(
        `${basePath}.container`,
        batch?.container ?? null,
        'memo',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_MEMO)
      ),
    },
    {
      columnKey: 'container.logs',
      type: 'container_logs',
      ...transformValueField(`${basePath}.container`, batch?.container ?? null, 'id', () => true),
    },
  ].map(cell => ({
    ...cell,
    disabled: !(batch?.container ?? null),
    duplicable: true,
  }));
}

function transformShipment(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Batch
): Array<CellValue> {
  const nbOfVoyages = (batch?.shipment?.voyages ?? []).length;

  return [
    {
      columnKey: 'shipment.created',
      type: 'date_user',
      ...transformComputedField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'created',
        currentBatch => {
          return currentBatch?.shipment
            ? {
                at: new Date(currentBatch?.shipment.createdAt ?? ''),
                by: currentBatch?.shipment.createdBy,
              }
            : null;
        }
      ),
    },
    {
      columnKey: 'shipment.createdBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'createdBy',
        batch?.shipment?.createdBy ?? null
      ),
    },
    {
      columnKey: 'shipment.createdAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'createdAt',
        batch?.shipment?.createdAt ?? null
      ),
    },
    {
      columnKey: 'shipment.updated',
      type: 'date_user',
      ...transformComputedField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'updated',
        currentBatch => {
          return currentBatch?.shipment
            ? {
                at: new Date(currentBatch?.shipment.updatedAt ?? ''),
                by: currentBatch?.shipment.updatedBy,
              }
            : null;
        }
      ),
    },
    {
      columnKey: 'shipment.updatedBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'updatedBy',
        batch?.shipment?.updatedBy ?? null
      ),
    },
    {
      columnKey: 'shipment.updatedAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'updatedAt',
        batch?.shipment?.updatedAt ?? null
      ),
    },
    {
      columnKey: 'shipment.archived',
      type: 'status',
      ...transformValueField(
        `${basePath}.shipment`,
        batch ? batch.shipment : null,
        'archived',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_ARCHIVED)
      ),
    },
    {
      columnKey: 'shipment.no',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'no',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_NO)
      ),
    },
    {
      columnKey: 'shipment.importer',
      type: 'partner',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'importer',
        batch?.shipment?.importer ?? null
      ),
    },
    {
      columnKey: 'shipment.exporter',
      type: 'partner',
      ...transformReadonlyField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'exporter',
        batch?.shipment?.exporter ?? null
      ),
    },
    {
      columnKey: 'shipment.inCharges',
      type: 'user_assignment',
      computed: currentBatch => {
        return [
          currentBatch?.shipment?.importer?.id,
          currentBatch?.shipment?.exporter?.id,
          ...(currentBatch?.shipment?.forwarders ?? []).map(f => f.id),
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
      columnKey: 'shipment.numOfVoyages',
      type: 'number',
      ...transformComputedField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'voyages',
        item => {
          return item?.shipment?.voyages?.length ?? 0;
        }
      ),
    },
    {
      columnKey: 'shipment.forwarders',
      type: 'partners',
      extra: { partnerTypes: ['Forwarder'] },
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'forwarders',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_FORWARDERS)
      ),
    },
    {
      columnKey: 'shipment.blNo',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'blNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_NO)
      ),
    },
    {
      columnKey: 'shipment.blDate',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'blDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_DATE)
      ),
    },
    {
      columnKey: 'shipment.bookingNo',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'bookingNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_NO)
      ),
    },
    {
      columnKey: 'shipment.booked',
      type: 'booked',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'booked',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKED)
      ),
    },
    {
      columnKey: 'shipment.bookingDate',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'bookingDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_DATE)
      ),
    },
    {
      columnKey: 'shipment.invoiceNo',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'invoiceNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INVOICE_NO)
      ),
    },
    {
      columnKey: 'shipment.contractNo',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'contractNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CONTRACT_NO)
      ),
    },
    {
      columnKey: 'shipment.transportType',
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
      columnKey: 'shipment.loadType',
      type: 'load_type',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'loadType',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_LOAD_TYPE)
      ),
    },
    {
      columnKey: 'shipment.incoterm',
      type: 'incoterm',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'incoterm',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INCOTERM)
      ),
    },
    {
      columnKey: 'shipment.carrier',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'carrier',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CARRIER)
      ),
    },
    {
      columnKey: 'shipment.tags',
      type: 'shipment_tags',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'tags',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TAGS)
      ),
    },
    {
      columnKey: 'shipment.memo',
      type: 'textarea',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'memo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_MEMO)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.cargoReady`,
        batch?.shipment?.cargoReady ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.cargoReady`,
        batch?.shipment?.cargoReady ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.cargoReady`,
        batch?.shipment?.cargoReady ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.cargoReady`,
        batch?.shipment?.cargoReady ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departurePort',
      type: 'port',
      computed: currentBatch => currentBatch?.shipment?.transportType ?? null,
      ...transformValueField(
        `${basePath}.shipment.voyages.0`,
        batch?.shipment?.voyages?.[0] ?? null,
        'departurePort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.voyages.0.departure`,
        batch?.shipment?.voyages?.[0]?.departure ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.voyages.0.departure`,
        batch?.shipment?.voyages?.[0]?.departure ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.voyages.0.departure`,
        batch?.shipment?.voyages?.[0]?.departure ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.voyages.0.departure`,
        batch?.shipment?.voyages?.[0]?.departure ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.vesselName',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment.voyages.0`,
        batch?.shipment?.voyages?.[0] ?? null,
        'vesselName',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.vesselCode',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment.voyages.0`,
        batch?.shipment?.voyages?.[0] ?? null,
        'vesselCode',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitPort',
      type: 'port',
      computed: currentBatch => currentBatch?.shipment?.transportType ?? null,
      ...transformValueField(
        `${basePath}.shipment.voyages.0`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[0] ?? null : null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.voyages.0.arrival`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[0]?.arrival ?? null : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.voyages.0.arrival`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[0]?.arrival ?? null : null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.voyages.0.arrival`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[0]?.arrival ?? null : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.voyages.0.arrival`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[0]?.arrival ?? null : null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.voyages.1.departure`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[1]?.departure ?? null : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.voyages.1.departure`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[1]?.departure ?? null : null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.voyages.1.departure`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[1]?.departure ?? null : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.voyages.1.departure`,
        nbOfVoyages > 1 ? batch?.shipment?.voyages?.[1]?.departure ?? null : null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.vesselName',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment.voyages.1`,
        batch?.shipment?.voyages?.[1] ?? null,
        'vesselName',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.vesselCode',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment.voyages.1`,
        batch?.shipment?.voyages?.[1] ?? null,
        'vesselCode',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitPort',
      type: 'port',
      computed: currentBatch => currentBatch?.shipment?.transportType ?? null,
      ...transformValueField(
        `${basePath}.shipment.voyages.1`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[1] ?? null : null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.voyages.1.arrival`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[1]?.arrival ?? null : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.voyages.1.arrival`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[1]?.arrival ?? null : null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.voyages.1.arrival`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[1]?.arrival ?? null : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.voyages.1.arrival`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[1]?.arrival ?? null : null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.voyages.2.departure`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[2]?.departure ?? null : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.voyages.2.departure`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[2]?.departure ?? null : null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.voyages.2.departure`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[2]?.departure ?? null : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.voyages.2.departure`,
        nbOfVoyages > 2 ? batch?.shipment?.voyages?.[2]?.departure ?? null : null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.vesselName',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment.voyages.2`,
        batch?.shipment?.voyages?.[2] ?? null,
        'vesselName',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.vesselCode',
      type: 'text',
      ...transformValueField(
        `${basePath}.shipment.voyages.2`,
        batch?.shipment?.voyages?.[2] ?? null,
        'vesselCode',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrivalPort',
      type: 'port',
      computed: currentBatch => currentBatch?.shipment?.transportType ?? null,
      ...transformValueField(
        `${basePath}.shipment.voyages.${(batch?.shipment?.voyages?.length ?? 0) - 1}`,
        batch?.shipment?.voyages?.[(batch?.shipment?.voyages?.length ?? 0) - 1] ?? null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.voyages.${(batch?.shipment?.voyages?.length ?? 0) - 1}.arrival`,
        batch?.shipment?.voyages?.[(batch?.shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.shipment.voyages.${(batch?.shipment?.voyages?.length ?? 0) - 1}.arrival`,
        batch?.shipment?.voyages?.[(batch?.shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.voyages.${(batch?.shipment?.voyages?.length ?? 0) - 1}.arrival`,
        batch?.shipment?.voyages?.[(batch?.shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.voyages.${(batch?.shipment?.voyages?.length ?? 0) - 1}.arrival`,
        batch?.shipment?.voyages?.[(batch?.shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.customClearance`,
        batch?.shipment?.containerGroups?.[0]?.customClearance ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.timelineDateRevisions',
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
      columnKey: 'shipment.containerGroup.customClearance.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.customClearance`,
        batch?.shipment?.containerGroups?.[0]?.customClearance ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.customClearance`,
        batch?.shipment?.containerGroups?.[0]?.customClearance ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouse',
      type: 'warehouse',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0`,
        batch?.shipment?.containerGroups?.[0] ?? null,
        'warehouse',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_WAREHOUSE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.date',
      type: 'date',
      hide: currentBatch => (currentBatch?.shipment?.containerCount ?? 0) > 0,
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.warehouseArrival`,
        batch?.shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.timelineDateRevisions',
      type: 'date_revisions',
      hide: currentBatch => (currentBatch?.shipment?.containerCount ?? 0) > 0,
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.warehouseArrival`,
        batch?.shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      hide: currentBatch => (currentBatch?.shipment?.containerCount ?? 0) > 0,
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.warehouseArrival`,
        batch?.shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.approved',
      type: 'approval',
      hide: currentBatch => (currentBatch?.shipment?.containerCount ?? 0) > 0,
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.warehouseArrival`,
        batch?.shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.deliveryReady`,
        batch?.shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.timelineDateRevisions',
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
      columnKey: 'shipment.containerGroup.deliveryReady.assignedTo',
      type: 'user_assignment',
      computed: currentBatch => {
        return [currentBatch?.shipment?.importer?.id, currentBatch?.shipment?.exporter?.id].filter(
          Boolean
        );
      },
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.deliveryReady`,
        batch?.shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.shipment.containerGroups.0.deliveryReady`,
        batch?.shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.files',
      type: 'shipment_documents',
      ...transformValueField(
        `${basePath}.shipment`,
        batch?.shipment ?? null,
        'files',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_DOCUMENTS)
      ),
    },
    {
      columnKey: 'shipment.todo',
      type: 'shipment_tasks',
      computed: currentBatch => {
        return {
          entityId: batch?.shipment?.id ?? null,
          ownerId: batch?.shipment?.ownedBy?.id,
          groupIds: [
            currentBatch?.shipment?.importer?.id,
            currentBatch?.shipment?.exporter?.id,
            ...(currentBatch?.shipment?.forwarders ?? []).map(f => f.id),
          ].filter(Boolean),
        };
      },
      ...transformValueField(
        basePath,
        batch?.shipment ?? null,
        'todo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TASKS)
      ),
    },
    {
      columnKey: 'shipment.logs',
      type: 'shipment_logs',
      ...transformValueField(`${basePath}.shipment`, batch?.shipment ?? null, 'id', () => true),
    },
    {
      columnKey: 'shipment.mask',
      type: 'mask',
      extra: { entityType: 'Shipment' },
      ...transformField(
        batch?.shipment ?? null,
        `${basePath}.customFields.mask`,
        'mask',
        batch?.shipment?.customFields?.mask ?? null,
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `shipment.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: currentBatch => {
        const mask = currentBatch?.shipment?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        batch?.shipment ?? null,
        fieldDefinition.id,
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CUSTOM_FIELDS)
      ),
    })),
  ].map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.shipment ?? null),
  }));
}

type Props = {
  orderFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
};

export default function transformer({
  orderFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
}: Props) {
  return (index: number, batch: Batch): Array<Array<CellValue>> => {
    const batchCells = transformBatch(batchFieldDefinitions, `${index}`, batch);
    const orderItemCells = transformOrderItem(
      orderItemFieldDefinitions,
      `${index}`,
      batch.orderItem
    );
    const orderCells = transformOrder(orderFieldDefinitions, `${index}`, batch.orderItem.order);
    const containerCells = transformContainer(`${index}`, batch);
    const shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, batch);

    return [[...batchCells, ...orderItemCells, ...orderCells, ...containerCells, ...shipmentCells]];
  };
}
