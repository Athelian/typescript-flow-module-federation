// @flow
import { calculateVolume, getBatchLatestQuantity } from 'utils/batch';
import { defaultVolumeMetric } from 'utils/metric';
import type { FieldDefinition } from 'types';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  transformValueField,
  transformReadonlyField,
  transformComputedField,
  transformCustomField,
  transformField,
} from 'components/Sheet';
import transformSheetOrder from 'modules/sheet/order/transformer';
import transformSheetShipment from 'modules/sheet/shipment/transformer';
import transformSheetContainer from 'modules/sheet/container/transformer';
import {
  ORDER_ITEMS_SET_NO,
  ORDER_ITEMS_SET_QUANTITY,
  ORDER_ITEMS_SET_PRICE,
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_DELIVERY_DATE,
  ORDER_ITEMS_SET_DOCUMENTS,
  ORDER_ITEMS_SET_TAGS,
  ORDER_ITEMS_SET_MEMO,
  ORDER_ITEMS_SET_TASKS,
  ORDER_ITEMS_SET_CUSTOM_FIELDS,
  ORDER_ITEMS_SET_CUSTOM_FIELDS_MASK,
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

function getCurrentBatch(batchId: string, shipment: Object): ?Object {
  return [
    ...shipment.batchesWithoutContainer,
    ...shipment.containers.map(c => c.batches).flat(),
  ].find(b => b.id === batchId);
}

function getCurrentOrderItem(orderItemId: string, shipment: Object): ?Object {
  return [...shipment.batchesWithoutContainer, ...shipment.containers.map(c => c.batches).flat()]
    .map(b => b.orderItem)
    .find(oi => oi.id === orderItemId);
}

function getCurrentOrder(orderId: string, shipment: Object): ?Object {
  return [...shipment.batchesWithoutContainer, ...shipment.containers.map(c => c.batches).flat()]
    .map(b => b.orderItem.order)
    .find(o => o.id === orderId);
}

function transformShipment(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  shipment: Object
): Array<CellValue> {
  return transformSheetShipment({
    fieldDefinitions,
    basePath,
    shipment,
    getShipmentFromRoot: root => root,
    readonlyExporter: false,
  }).map(c => ({
    ...c,
    empty: !shipment,
    parent: true,
  }));
}

function transformContainer(
  basePath: string,
  container: ?Object,
  hasContainers: boolean
): Array<CellValue> {
  return transformSheetContainer({
    basePath,
    container,
    getContainerFromRoot: root => root.containers.find(c => c.id === container?.id),
    getShipmentFromRoot: root => root,
  }).map(c => ({
    ...c,
    disabled: !hasContainers && !container,
    empty: hasContainers && !container,
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
      columnKey: 'shipment.container.batch.created',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'created', shipment => {
        const currentBatch = getCurrentBatch(batch?.id, shipment);
        return currentBatch
          ? {
              at: new Date(currentBatch.createdAt),
              by: currentBatch.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.container.batch.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'createdBy', batch?.createdBy ?? null),
    },
    {
      columnKey: 'shipment.container.batch.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'createdAt', batch?.createdAt ?? null),
    },
    {
      columnKey: 'shipment.container.batch.updated',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'updated', shipment => {
        const currentBatch = getCurrentBatch(batch?.id, shipment);
        return currentBatch
          ? {
              at: new Date(currentBatch.updatedAt),
              by: currentBatch.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.container.batch.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'updatedBy', batch?.updatedBy ?? null),
    },
    {
      columnKey: 'shipment.container.batch.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'updatedAt', batch?.updatedAt ?? null),
    },
    {
      columnKey: 'shipment.container.batch.archived',
      type: 'status',
      disabled: !batch,
      parent: true,
      ...transformComputedField(basePath, batch, 'archived', shipment => {
        const currentBatch = getCurrentBatch(batch?.id, shipment);
        return (shipment.archived && currentBatch?.orderItem?.order?.archived) ?? true;
      }),
    },
    {
      columnKey: 'shipment.container.batch.no',
      type: 'text',
      ...transformValueField(
        basePath,
        batch,
        'no',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_NO)
      ),
    },
    {
      columnKey: 'shipment.container.batch.deliveredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'deliveredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.desiredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'desiredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_DESIRED_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.expiredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'expiredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_EXPIRY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.producedAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'producedAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PRODUCTION_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.latestQuantity',
      type: 'number',
      ...transformComputedField(basePath, batch, 'latestQuantity', shipment => {
        const currentBatch = getCurrentBatch(batch?.id, shipment);
        return getBatchLatestQuantity(currentBatch);
      }),
    },
    {
      columnKey: 'shipment.container.batch.quantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'quantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.producedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'producedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.preShippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'preShippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.shippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'shippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.postShippedQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'postShippedQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.deliveredQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'deliveredQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.packageName',
      type: 'text',
      ...transformValueField(
        basePath,
        batch,
        'packageName',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_NAME)
      ),
    },
    {
      columnKey: 'shipment.container.batch.packageCapacity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'packageCapacity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_CAPACITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.packageQuantity',
      type: 'number_toggle',
      computed: shipment => {
        const currentBatch = getCurrentBatch(batch?.id, shipment);
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
      columnKey: 'shipment.container.batch.packageGrossWeight',
      type: 'mass',
      ...transformValueField(
        basePath,
        batch,
        'packageGrossWeight',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_WEIGHT)
      ),
    },
    {
      columnKey: 'shipment.container.batch.packageVolume',
      type: 'volume_toggle',
      computed: shipment => {
        const currentBatch = getCurrentBatch(batch?.id, shipment);
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
      columnKey: 'shipment.container.batch.packageSize',
      type: 'size',
      ...transformValueField(
        basePath,
        batch,
        'packageSize',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_SIZE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.tags',
      type: 'batch_tags',
      ...transformValueField(
        basePath,
        batch,
        'tags',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_TAGS)
      ),
    },
    {
      columnKey: 'shipment.container.batch.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        batch,
        'memo',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_MEMO)
      ),
    },
    {
      columnKey: 'shipment.container.batch.todo',
      type: 'batch_tasks',
      computed: shipment => {
        const currentBatch = getCurrentBatch(batch?.id, shipment);
        return {
          entityId: batch?.id,
          ownerId: batch?.ownedBy?.id,
          groupIds: [
            currentBatch?.orderItem?.order?.importer?.id,
            currentBatch?.orderItem?.order?.exporter?.id,
          ].filter(Boolean),
        };
      },
      ...transformValueField(
        basePath,
        batch,
        'todo',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_TASKS)
      ),
    },
    {
      columnKey: 'shipment.container.batch.logs',
      type: 'batch_logs',
      ...transformValueField(basePath, batch, 'id', () => true),
    },
    {
      columnKey: 'shipment.container.batch.mask',
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
      columnKey: `shipment.container.batch.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: shipment => {
        const currentBatch = getCurrentBatch(batch?.id, shipment);
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

function transformBatchOrderItem(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return [
    {
      columnKey: 'shipment.container.batch.orderItem.created',
      type: 'date_user',
      ...transformComputedField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'created',
        shipment => {
          const currentOrderItem = getCurrentOrderItem(batch?.orderItem?.id, shipment);
          return currentOrderItem
            ? {
                at: new Date(currentOrderItem.createdAt),
                by: currentOrderItem.createdBy,
              }
            : null;
        }
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.createdBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'createdBy',
        batch?.orderItem?.createdBy ?? null
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.createdAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'createdAt',
        batch?.orderItem?.createdAt ?? null
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.updated',
      type: 'date_user',
      ...transformComputedField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'updated',
        shipment => {
          const currentOrderItem = getCurrentOrderItem(batch?.orderItem?.id, shipment);
          return currentOrderItem
            ? {
                at: new Date(currentOrderItem.updatedAt),
                by: currentOrderItem.updatedBy,
              }
            : null;
        }
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.updatedBy',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'updatedBy',
        batch?.orderItem?.updatedBy ?? null
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.updatedAt',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'updatedAt',
        batch?.orderItem?.updatedAt ?? null
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.productProvider.product.name',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.orderItem.productProvider.product`,
        batch?.orderItem?.productProvider?.product ?? null,
        'name',
        batch?.orderItem?.productProvider?.product?.name ?? ''
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.productProvider.product.serial',
      type: 'text',
      ...transformReadonlyField(
        `${basePath}.orderItem.productProvider.product`,
        batch?.orderItem?.productProvider?.product ?? null,
        'serial',
        batch?.orderItem?.productProvider?.product?.serial ?? ''
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.archived',
      type: 'status',
      ...transformComputedField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'archived',
        shipment => {
          const currentOrderItem = getCurrentOrderItem(batch?.orderItem?.id, shipment);
          return currentOrderItem?.order?.archived ?? false;
        }
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.no',
      type: 'text',
      ...transformValueField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'no',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_NO)
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.quantity',
      type: 'number',
      ...transformValueField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'quantity',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.price',
      type: 'static_metric_value',
      ...transformValueField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'price',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_PRICE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.deliveryDate',
      type: 'date',
      ...transformValueField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'deliveryDate',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.tags',
      type: 'order_item_tags',
      ...transformValueField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'tags',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_TAGS)
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.memo',
      type: 'textarea',
      ...transformValueField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'memo',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_MEMO)
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.files',
      type: 'order_item_documents',
      ...transformValueField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'files',
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_DOCUMENTS)
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.todo',
      type: 'order_item_tasks',
      computed: item => ({
        entityId: batch?.orderItem?.id,
        ownerId: batch?.orderItem?.ownedBy?.id,
        groupIds: [item.importer?.id, item.exporter?.id].filter(Boolean),
      }),
      ...transformValueField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        'todo',
        hasPermission => hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_TASKS)
      ),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.logs',
      type: 'order_item_logs',
      ...transformValueField(`${basePath}.orderItem`, batch?.orderItem ?? null, 'id', () => true),
    },
    {
      columnKey: 'shipment.container.batch.orderItem.mask',
      type: 'mask',
      extra: { entityType: 'OrderItem' },
      ...transformField(
        batch?.orderItem ?? null,
        `${basePath}.customFields.mask`,
        'mask',
        batch?.orderItem?.customFields?.mask ?? null,
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `shipment.container.batch.orderItem.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: shipment => {
        const currentOrderItem = getCurrentOrderItem(batch?.orderItem?.id, shipment);
        const mask = currentOrderItem?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        `${basePath}.orderItem`,
        batch?.orderItem ?? null,
        fieldDefinition.id,
        hasPermission =>
          hasPermission(ORDER_ITEMS_UPDATE) || hasPermission(ORDER_ITEMS_SET_CUSTOM_FIELDS)
      ),
    })),
  ].map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.orderItem ?? null),
  }));
}

function transformBatchOrderItemOrder(
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: Object
): Array<CellValue> {
  return transformSheetOrder({
    fieldDefinitions,
    basePath: `${basePath}.orderItem.order`,
    order: batch?.orderItem?.order ?? null,
    getOrderFromRoot: root => getCurrentOrder(batch?.orderItem?.order?.id, root),
    readonlyExporter: true,
  }).map(c => ({
    ...c,
    duplicable: true,
    disabled: !(batch?.orderItem?.order ?? null),
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
  return (index: number, shipment: Object): Array<Array<CellValue>> => {
    const rows = [];

    let shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, shipment);

    (shipment?.batchesWithoutContainer ?? []).forEach((batch, batchIdx) => {
      rows.push([
        ...shipmentCells,
        ...transformContainer(`${index}.containers.-1`, null, false),
        ...transformBatch(
          batchFieldDefinitions,
          `${index}.batchesWithoutContainer.${batchIdx}`,
          batch
        ),
        ...transformBatchOrderItem(
          orderItemFieldDefinitions,
          `${index}.batchesWithoutContainer.${batchIdx}`,
          batch
        ),
        ...transformBatchOrderItemOrder(
          orderFieldDefinitions,
          `${index}.batchesWithoutContainer.${batchIdx}`,
          batch
        ),
      ]);

      shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, null);
    });

    if ((shipment?.containers?.length ?? 0) > 0) {
      (shipment?.containers ?? []).forEach((container, containerIdx) => {
        let containerCells = transformContainer(
          `${index}.containers.${containerIdx}`,
          container,
          true
        );

        if ((container?.batches?.length ?? 0) > 0) {
          (container?.batches ?? []).forEach((batch, batchIdx) => {
            rows.push([
              ...shipmentCells,
              ...containerCells,
              ...transformBatch(
                batchFieldDefinitions,
                `${index}.containers.${containerIdx}.batches.${batchIdx}`,
                batch
              ),
              ...transformBatchOrderItem(
                orderItemFieldDefinitions,
                `${index}.containers.${containerIdx}.batches.${batchIdx}`,
                batch
              ),
              ...transformBatchOrderItemOrder(
                orderFieldDefinitions,
                `${index}.containers.${containerIdx}.batches.${batchIdx}`,
                batch
              ),
            ]);

            containerCells = transformContainer(`${index}.containers.${containerIdx}`, null, true);
            shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, null);
          });
        } else {
          rows.push([
            ...shipmentCells,
            ...containerCells,
            ...transformBatch(
              batchFieldDefinitions,
              `${index}.containers.${containerIdx}.batches.-1`,
              null
            ),
            ...transformBatchOrderItem(
              orderItemFieldDefinitions,
              `${index}.containers.${containerIdx}.batches.-1`,
              null
            ),
            ...transformBatchOrderItemOrder(
              orderFieldDefinitions,
              `${index}.containers.${containerIdx}.batches.-1`,
              null
            ),
          ]);

          shipmentCells = transformShipment(shipmentFieldDefinitions, `${index}`, null);
        }
      });
    } else if ((shipment?.batchesWithoutContainer?.length ?? 0) === 0) {
      rows.push([
        ...shipmentCells,
        ...transformContainer(`${index}.containers.-1`, null, false),
        ...transformBatch(batchFieldDefinitions, `${index}.containers.-1.batches.-1`, null),
        ...transformBatchOrderItem(
          orderItemFieldDefinitions,
          `${index}.containers.-1.batches.-1`,
          null
        ),
        ...transformBatchOrderItemOrder(
          orderFieldDefinitions,
          `${index}.containers.-1.batches.-1`,
          null
        ),
      ]);
    }

    return rows;
  };
}
