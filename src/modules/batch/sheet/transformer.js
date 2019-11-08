// @flow
import type { Batch } from 'generated/graphql';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  transformComputedField,
  transformReadonlyField,
  transformValueField,
} from 'components/Sheet';
import {
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
  BATCH_SET_QUANTITY_ADJUSTMENTS,
  BATCH_SET_TAGS,
  BATCH_SET_TASKS,
  BATCH_UPDATE,
} from 'modules/permission/constants/batch';
import { calculateVolume, getBatchLatestQuantity } from 'utils/batch';
import { defaultVolumeMetric } from 'utils/metric';

function transformBatch(basePath: string, batch: Batch): Array<CellValue> {
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
      columnKey: 'batch.quantityRevisions',
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
  ].map(c => ({
    ...c,
    disabled: !batch,
  }));
}

function transformOrderItem(basePath: string, orderItem: Object): Array<CellValue> {
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
  ];
}

export default function transformer(index: number, batch: Batch): Array<Array<CellValue>> {
  const batchCells = transformBatch(`${index}`, batch);
  const orderItemCells = transformOrderItem(`${index}`, batch.orderItem);

  return [[...batchCells, ...orderItemCells]];
}
