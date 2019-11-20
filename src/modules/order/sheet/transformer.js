// @flow
import { calculateVolume, getBatchLatestQuantity } from 'utils/batch';
import { defaultVolumeMetric } from 'utils/metric';
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  transformComputedField,
  transformReadonlyField,
  transformCustomField,
  transformValueField,
  transformField,
  transformActionField,
} from 'components/Sheet';
import transformSheetOrder from 'modules/sheet/order/transformer';
import transformSheetOrderItem from 'modules/sheet/orderItem/transformer';
import transformSheetShipment from 'modules/sheet/shipment/transformer';
import transformSheetContainer from 'modules/sheet/container/transformer';
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

function getCurrentBatch(batchId: string, order: Object): ?Object {
  return order.orderItems
    .map(oi => oi.batches)
    .flat()
    .find(oi => oi.id === batchId);
}

function transformOrder(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  order: Object
): Array<CellValue> {
  return transformSheetOrder({
    fieldDefinitions,
    basePath,
    order,
    getOrderFromRoot: root => root,
    readonlyExporter: false,
  }).map(c => ({
    ...c,
    empty: !order,
    parent: true,
  }));
}

function transformOrderItem(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  orderItem: Object,
  hasItems: boolean
): Array<CellValue> {
  return [
    ...transformSheetOrderItem({
      fieldDefinitions,
      basePath,
      orderItem,
      getOrderFromRoot: root => root,
      getOrderItemFromRoot: root => root.orderItems.find(oi => oi.id === orderItem?.id),
    }),
    {
      columnKey: 'orderItem.action',
      ...transformActionField(basePath, orderItem, [
        { action: 'batch_create', label: 'Create Batch' },
      ]),
    },
  ].map(c => ({
    ...c,
    disabled: !hasItems && !orderItem,
    empty: hasItems && !orderItem,
    parent: true,
  }));
}

function transformBatch(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return [
    {
      columnKey: 'order.orderItem.batch.created',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'created', item => {
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
      ...transformComputedField(basePath, batch, 'updated', item => {
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
      ...transformComputedField(basePath, batch, 'archived', order => {
        const currentBatch = getCurrentBatch(batch?.id, order);

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
      columnKey: 'order.orderItem.batch.latestQuantity',
      type: 'number',
      ...transformComputedField(basePath, batch, 'latestQuantity', order => {
        const currentBatch = getCurrentBatch(batch?.id, order);
        return getBatchLatestQuantity(currentBatch);
      }),
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
      columnKey: 'order.orderItem.batch.producedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'producedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.preShippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'preShippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.shippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'shippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.postShippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'postShippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.deliveredQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'deliveredQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
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
      columnKey: 'order.orderItem.batch.packageGrossWeight',
      type: 'mass',
      ...transformValueField(
        basePath,
        batch,
        'packageGrossWeight',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_WEIGHT)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.packageVolume',
      type: 'volume_toggle',
      computed: order => {
        const currentBatch = getCurrentBatch(batch?.id, order);
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
      columnKey: 'order.orderItem.batch.packageSize',
      type: 'size',
      ...transformValueField(
        basePath,
        batch,
        'packageSize',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_SIZE)
      ),
    },
    {
      columnKey: 'order.orderItem.batch.todo',
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
      columnKey: 'order.orderItem.batch.logs',
      type: 'batch_logs',
      ...transformValueField(basePath, batch, 'id', () => true),
    },
    {
      columnKey: 'order.orderItem.batch.mask',
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
      columnKey: `order.orderItem.batch.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: order => {
        const currentBatch = getCurrentBatch(batch?.id, order);
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
  ].map(c => ({
    ...c,
    disabled: !batch,
  }));
}

function transformBatchContainer(basePath: string, batch: Object): Array<CellValue> {
  return transformSheetContainer({
    basePath,
    container: batch?.container ?? null,
    getContainerFromRoot: root => {
      const currentBatch = getCurrentBatch(batch?.id, root);
      return currentBatch?.container;
    },
    getShipmentFromRoot: root => {
      const currentBatch = getCurrentBatch(batch?.id, root);
      return currentBatch?.shipment;
    },
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.container ?? null),
  }));
}

function transformBatchShipment(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return transformSheetShipment({
    fieldDefinitions,
    basePath,
    shipment: batch?.shipment ?? null,
    getShipmentFromRoot: root => {
      const currentBatch = getCurrentBatch(batch?.id, root);
      return currentBatch?.shipment ?? null;
    },
    readonlyExporter: true,
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.shipment ?? null),
  }));
}

function transformFullBatch(
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return [
    ...transformBatch(batchFieldDefinitions, basePath, batch),
    ...transformBatchContainer(`${basePath}.container`, batch),
    ...transformBatchShipment(shipmentFieldDefinitions, `${basePath}.shipment`, batch),
  ];
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
  return (index: number, order: Object): Array<Array<CellValue>> => {
    const rows = [];

    let orderCells = transformOrder(orderFieldDefinitions, `${index}`, order);

    if ((order?.orderItems?.length ?? 0) > 0) {
      (order?.orderItems ?? []).forEach((orderItem, orderItemIdx) => {
        let orderItemCells = transformOrderItem(
          orderItemFieldDefinitions,
          `${index}.orderItems.${orderItemIdx}`,
          orderItem,
          true
        );

        if ((orderItem?.batches?.length ?? 0) > 0) {
          (orderItem?.batches ?? []).forEach((batch, batchIdx) => {
            rows.push([
              ...orderCells,
              ...orderItemCells,
              ...transformFullBatch(
                batchFieldDefinitions,
                shipmentFieldDefinitions,
                `${index}.orderItems.${orderItemIdx}.batches.${batchIdx}`,
                batch
              ),
            ]);
            orderCells = transformOrder(orderFieldDefinitions, `${index}`, null);
            orderItemCells = transformOrderItem(
              orderItemFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}`,
              null,
              true
            );
          });
        } else {
          rows.push([
            ...orderCells,
            ...transformOrderItem(
              orderItemFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}`,
              orderItem,
              true
            ),
            ...transformFullBatch(
              batchFieldDefinitions,
              shipmentFieldDefinitions,
              `${index}.orderItems.${orderItemIdx}.batches.0`,
              null
            ),
          ]);
          orderCells = transformOrder(orderFieldDefinitions, `${index}`, null);
        }
      });
    } else {
      rows.push([
        ...orderCells,
        ...transformOrderItem(orderItemFieldDefinitions, `${index}.orderItems.0`, null, false),
        ...transformFullBatch(
          batchFieldDefinitions,
          shipmentFieldDefinitions,
          `${index}.orderItems.0.batches.0`,
          null
        ),
      ]);
    }

    return rows;
  };
}
