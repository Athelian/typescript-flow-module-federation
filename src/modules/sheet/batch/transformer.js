// @flow
import { calculatePackageQuantity, calculateVolume, getBatchLatestQuantity } from 'utils/batch';
import { defaultVolumeMetric } from 'utils/metric';
import type { FieldDefinition } from 'types';
import type { CellAction, CellValue } from 'components/Sheet/SheetState/types';
import {
  transformActionField,
  transformComputedField,
  transformCustomField,
  transformField,
  transformReadonlyField,
  transformValueField,
} from 'components/Sheet';
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
  BATCH_SET_FOLLOWERS,
  BATCH_UPDATE,
} from 'modules/permission/constants/batch';
import { differenceInCalendarDays } from 'date-fns';
import { getLatestDate } from 'utils/shipment';

type Props = {|
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  batch: ?Object,
  getOrderFromRoot: Object => ?Object,
  getShipmentFromRoot: Object => ?Object,
  getContainerFromRoot: Object => ?Object,
  getBatchFromRoot: Object => ?Object,
  actions: Array<CellAction>,
|};

export default function transformSheetBatch({
  fieldDefinitions,
  basePath,
  batch,
  getOrderFromRoot,
  getShipmentFromRoot,
  getContainerFromRoot,
  getBatchFromRoot,
  actions,
}: Props): Array<CellValue> {
  return [
    {
      columnKey: 'batch.created',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'created', root => {
        const currentBatch = getBatchFromRoot(root);
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
      ...transformComputedField(basePath, batch, 'updated', root => {
        const currentBatch = getBatchFromRoot(root);
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
      ...transformComputedField(
        basePath,
        batch,
        'archived',
        root =>
          (getOrderFromRoot(root)?.archived ?? true) &&
          (getShipmentFromRoot(root)?.archived ?? true)
      ),
    },
    {
      columnKey: 'batch.followers',
      type: 'followers',
      computed: root => {
        const currentBatch = getBatchFromRoot(root);
        return [
          currentBatch?.orderItem?.order?.importer?.id,
          currentBatch?.orderItem?.order?.exporter?.id,
          currentBatch?.shipment?.importer?.id,
          currentBatch?.shipment?.exporter?.id,
          ...(currentBatch?.shipment?.forwarders ?? []).map(forwarder => forwarder?.id),
        ].filter(Boolean);
      },
      ...transformValueField(
        basePath,
        batch,
        'followers',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_FOLLOWERS)
      ),
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
      columnKey: 'batch.deliveredAtDifference',
      type: 'date_difference',
      ...transformComputedField(basePath, batch, 'deliveredAtDifference', root => {
        const currentBatch = getBatchFromRoot(root);
        const currentShipment = getShipmentFromRoot(root);

        const deliveredAt = currentBatch?.deliveredAt;
        const latestDeparture = getLatestDate(currentShipment?.voyages?.[0]?.departure);
        if (!deliveredAt || !latestDeparture) return null;

        return differenceInCalendarDays(new Date(deliveredAt), new Date(latestDeparture));
      }),
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
      columnKey: 'batch.desiredAtDifference',
      type: 'date_difference',
      ...transformComputedField(basePath, batch, 'desiredAtDifference', root => {
        const currentBatch = getBatchFromRoot(root);
        const currentShipment = getShipmentFromRoot(root);
        const currentContainer = getContainerFromRoot(root);

        const desiredAt = currentBatch?.desiredAt;
        let latestArrival = null;
        if (currentContainer) {
          latestArrival = currentContainer?.warehouseArrivalActualDate;
        } else if (
          currentShipment &&
          !((currentShipment?.containers ?? []).length > 0 || currentShipment?.containerCount > 0)
        ) {
          latestArrival = getLatestDate(currentShipment?.containerGroups?.[0]?.warehouseArrival);
        }

        if (!desiredAt || !latestArrival) return null;

        return differenceInCalendarDays(new Date(desiredAt), new Date(latestArrival));
      }),
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
      ...transformComputedField(basePath, batch, 'latestQuantity', root =>
        getBatchLatestQuantity(getBatchFromRoot(root))
      ),
    },
    {
      columnKey: 'batch.differenceQuantity',
      type: 'number',
      ...transformComputedField(basePath, batch, 'differenceQuantity', root => {
        const currentBatch = getBatchFromRoot(root);
        return (currentBatch?.quantity ?? 0) - getBatchLatestQuantity(currentBatch);
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
      computed: root => calculatePackageQuantity(getBatchFromRoot(root)),
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
      computed: root => {
        const currentBatch = getBatchFromRoot(root);
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
      computed: root => {
        const currentOrder = getOrderFromRoot(root);
        return {
          entityId: batch?.id,
          ownerId: batch?.ownedBy?.id,
          groupIds: [currentOrder?.importer?.id, currentOrder?.exporter?.id].filter(Boolean),
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
      hide: root => {
        const currentBatch = getBatchFromRoot(root);
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
    {
      columnKey: 'batch.action',
      ...transformActionField(basePath, batch, actions),
    },
  ];
}
