// @flow
import type { Batch } from 'generated/graphql';
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
      computed: currentBatch =>
        calculateVolume(
          currentBatch?.packageVolume?.value ?? { value: 0, metric: defaultVolumeMetric },
          currentBatch?.packageSize
        ),
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
  return transformSheetOrderItem({
    fieldDefinitions,
    basePath,
    orderItem,
    getOrderFromRoot: root => root.orderItem.order,
    getOrderItemFromRoot: root => root.orderItem,
  }).map(c => ({
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
  return transformSheetContainer({
    basePath: `${basePath}.container`,
    container: batch?.container ?? null,
    getContainerFromRoot: root => {
      return root.container;
    },
    getShipmentFromRoot: root => {
      return root.shipment;
    },
  }).map(cell => ({
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
