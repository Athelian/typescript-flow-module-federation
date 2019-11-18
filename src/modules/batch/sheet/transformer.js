// @flow
import type { Batch } from 'generated/graphql';
import { addDays } from 'date-fns';
import { calculateVolume, getBatchLatestQuantity } from 'utils/batch';
import { getLatestDate } from 'utils/shipment';
import { defaultVolumeMetric } from 'utils/metric';
import { startOfToday, differenceInCalendarDays, calculateDueDate } from 'utils/date';
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  transformComputedField,
  transformReadonlyField,
  transformCustomField,
  transformValueField,
  transformField,
} from 'components/Sheet';
import transformSheetOrder from 'modules/sheet/order/transformer';
import transformSheetShipment from 'modules/sheet/shipment/transformer';
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
      columnKey: 'batch.producedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'producedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'batch.preShippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'preShippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'batch.shippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'shippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'batch.postShippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'postShippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'batch.deliveredQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'deliveredQuantity',
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
  order: ?Object
): Array<CellValue> {
  return transformSheetOrder({
    fieldDefinitions,
    basePath: `${basePath}.orderItem.order`,
    order,
    getOrderFromRoot: root => root?.orderItem?.order,
    readonlyExporter: true,
  }).map(c => ({
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
  return transformSheetShipment({
    fieldDefinitions,
    basePath: `${basePath}.shipment`,
    shipment: batch?.shipment ?? null,
    getShipmentFromRoot: root => root?.shipment ?? null,
    readonlyExporter: true,
  }).map(c => ({
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
      batch?.orderItem
    );
    const orderCells = transformOrder(orderFieldDefinitions, `${index}`, batch.orderItem.order);
    const containerCells = transformContainer(`${index}`, batch);
    const shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, batch);

    return [[...batchCells, ...orderItemCells, ...orderCells, ...containerCells, ...shipmentCells]];
  };
}
