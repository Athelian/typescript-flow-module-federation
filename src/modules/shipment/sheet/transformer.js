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

function getCurrentBatch(batchId: string, shipment: Object): ?Object {
  return [
    ...shipment.batchesWithoutContainer,
    ...shipment.containers.map(c => c.batches).flat(),
  ].find(b => b.id === batchId);
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
  return transformSheetOrderItem({
    fieldDefinitions,
    basePath: `${basePath}.orderItem`,
    orderItem: batch?.orderItem ?? null,
    getOrderFromRoot: root => getCurrentBatch(batch?.id, root)?.orderItem?.order,
    getOrderItemFromRoot: root => getCurrentBatch(batch?.id, root)?.orderItem,
  }).map(c => ({
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
