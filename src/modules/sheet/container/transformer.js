// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { calculateDueDate, startOfToday } from 'utils/date';
import { convertVolume, convertWeight } from 'utils/metric';
import { getLatestDate } from 'utils/shipment';
import type { FieldDefinition } from 'types';
import { calculatePackageQuantity, calculateVolume, getBatchLatestQuantity } from 'utils/batch';
import { getMaxVolume } from 'utils/container';
import type { CellValue } from 'components/Sheet/SheetState/types';
import {
  transformComputedField,
  transformReadonlyField,
  transformField,
  transformValueField,
  transformCustomField,
} from 'components/Sheet';
import {
  CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
  CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
  CONTAINER_APPROVE_DEPARTURE_DATE,
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
  CONTAINER_SET_CUSTOM_FIELDS,
  CONTAINER_SET_CUSTOM_FIELDS_MASK,
} from 'modules/permission/constants/container';

type Props = {|
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  container: ?Object,
  getContainerFromRoot: Object => ?Object,
  getShipmentFromRoot: Object => ?Object,
|};

export default function transformSheetContainer({
  fieldDefinitions,
  basePath,
  container,
  getContainerFromRoot,
  getShipmentFromRoot,
}: Props): Array<CellValue> {
  return [
    {
      columnKey: 'container.created',
      type: 'date_user',
      ...transformComputedField(basePath, container, 'created', root => {
        const currentContainer = getContainerFromRoot(root);
        return currentContainer
          ? {
              at: new Date(currentContainer.createdAt),
              by: currentContainer.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'container.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'createdBy', container?.createdBy ?? null),
    },
    {
      columnKey: 'container.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'createdAt', container?.createdAt ?? null),
    },
    {
      columnKey: 'container.updated',
      type: 'date_user',
      ...transformComputedField(basePath, container, 'updated', root => {
        const currentContainer = getContainerFromRoot(root);
        return currentContainer
          ? {
              at: new Date(currentContainer.updatedAt),
              by: currentContainer.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'container.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'updatedBy', container?.updatedBy ?? null),
    },
    {
      columnKey: 'container.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'updatedAt', container?.updatedAt ?? null),
    },
    {
      columnKey: 'container.archived',
      type: 'status',
      ...transformComputedField(basePath, container, 'archived', root => {
        const currentShipment = getShipmentFromRoot(root);
        return currentShipment?.archived ?? true;
      }),
    },
    {
      columnKey: 'container.no',
      type: 'text',
      ...transformValueField(
        basePath,
        container,
        'no',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_NO)
      ),
    },
    {
      columnKey: 'container.containerType',
      type: 'container_type',
      ...transformValueField(
        basePath,
        container,
        'containerType',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_CONTAINER_TYPE)
      ),
    },
    {
      columnKey: 'container.maxVolume',
      type: 'maskable_metric_value',
      extra: {
        tooltipMessage: <FormattedMessage id="module.container.maxVolumeTooltip" />,
        displayMessage: <FormattedMessage id="components.cards.na" />,
      },
      ...transformComputedField(basePath, container, 'maxVolume', root => {
        const currentContainer = getContainerFromRoot(root);
        const maxVolumeValue = getMaxVolume(currentContainer?.containerType);

        if (maxVolumeValue) {
          return {
            value: maxVolumeValue,
            metric: 'm³',
          };
        }

        return null;
      }),
    },
    {
      columnKey: 'container.containerOption',
      type: 'container_option',
      ...transformValueField(
        basePath,
        container,
        'containerOption',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_CONTAINER_OPTION)
      ),
    },
    {
      columnKey: 'container.warehouseArrivalAgreedDate',
      type: 'datetime',
      ...transformValueField(
        basePath,
        container,
        'warehouseArrivalAgreedDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_AGREE_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'container.warehouseArrivalAgreedDateApproved',
      type: 'approval',
      ...transformValueField(
        basePath,
        container,
        'warehouseArrivalAgreedDateApproved',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_APPROVE_AGREE_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'container.warehouseArrivalActualDate',
      type: 'datetime',
      ...transformValueField(
        basePath,
        container,
        'warehouseArrivalActualDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_ACTUAL_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'container.warehouseArrivalActualDateApproved',
      type: 'approval',
      ...transformValueField(
        basePath,
        container,
        'warehouseArrivalActualDateApproved',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'container.warehouse',
      type: 'warehouse',
      ...transformValueField(
        basePath,
        container,
        'warehouse',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_WAREHOUSE)
      ),
    },
    {
      columnKey: 'container.freeTime',
      type: 'text',
      ...transformComputedField(basePath, container, 'freeTime', root => {
        const currentContainer = getContainerFromRoot(root);
        const { value: freeTimeStartDate } = currentContainer?.freeTimeStartDate ?? {
          value: null,
        };
        const dueDate = freeTimeStartDate
          ? calculateDueDate(freeTimeStartDate, currentContainer?.freeTimeDuration)
          : null;

        return dueDate ? differenceInCalendarDays(dueDate, startOfToday()) : 0;
      }),
    },
    {
      columnKey: 'container.freeTimeStartDate',
      type: 'date_toggle',
      computed: root => {
        const currentContainer = getContainerFromRoot(root);
        const currentShipment = getShipmentFromRoot(root);

        const auto = currentContainer?.autoCalculatedFreeTimeStartDate ?? false;
        const voyages = currentShipment?.voyages ?? [];
        if (voyages.length === 0) {
          return null;
        }

        return auto ? getLatestDate(voyages[voyages.length - 1]?.arrival) : null;
      },
      ...transformValueField(
        basePath,
        container,
        'freeTimeStartDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_FREE_TIME_START_DATE)
      ),
    },
    {
      columnKey: 'container.freeTimeDuration',
      type: 'day',
      ...transformValueField(
        basePath,
        container,
        'freeTimeDuration',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_FREE_TIME_DURATION)
      ),
    },
    {
      columnKey: 'container.dueDate',
      type: 'date',
      ...transformComputedField(basePath, container, 'dueDate', root => {
        const currentContainer = getContainerFromRoot(root);
        const date = currentContainer?.freeTimeStartDate?.value;
        return date ? addDays(new Date(date), currentContainer?.freeTimeDuration ?? 0) : null;
      }),
    },
    {
      columnKey: 'container.yardName',
      type: 'text',
      ...transformValueField(
        basePath,
        container,
        'yardName',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_YARD_NAME)
      ),
    },
    {
      columnKey: 'container.departureDate',
      type: 'date',
      ...transformValueField(
        basePath,
        container,
        'departureDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_DEPARTURE_DATE)
      ),
    },
    {
      columnKey: 'container.departureDateApproved',
      type: 'approval',
      ...transformValueField(
        basePath,
        container,
        'departureDateApproved',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_APPROVE_DEPARTURE_DATE)
      ),
    },
    {
      columnKey: 'container.tags',
      type: 'container_tags',
      ...transformValueField(
        basePath,
        container,
        'tags',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_TAGS)
      ),
    },
    {
      columnKey: 'container.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        container,
        'memo',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_MEMO)
      ),
    },
    {
      columnKey: 'container.totalPrice',
      type: 'maskable_metric_value',
      extra: {
        tooltipMessage: (
          <FormattedMessage
            id="modules.container.totalPriceUnavailable"
            defaultMessage="Cannot calculate due to mixed currencies"
          />
        ),
      },
      ...transformComputedField(basePath, container, 'totalPrice', root => {
        const currentContainer = getContainerFromRoot(root);

        const currencies = (currentContainer?.batches ?? []).reduce(
          (list, batch) => list.add(batch.orderItem.price.metric),
          new Set()
        );

        if (currencies.size === 0) {
          return { value: 0, metric: '' };
        }

        if (currencies.size === 1) {
          const totalPrice = (currentContainer?.batches ?? []).reduce(
            (total, batch) => total + getBatchLatestQuantity(batch) * batch.orderItem.price.value,
            0
          );

          return { value: totalPrice, metric: Array.from(currencies)[0] };
        }

        return null;
      }),
    },
    {
      columnKey: 'container.totalBatchQuantity',
      type: 'number',
      ...transformComputedField(basePath, container, 'totalBatchQuantity', root => {
        const currentContainer = getContainerFromRoot(root);
        return (currentContainer?.batches ?? []).reduce(
          (total, batch) => total + getBatchLatestQuantity(batch),
          0
        );
      }),
    },
    {
      columnKey: 'container.totalItems',
      type: 'number',
      ...transformComputedField(basePath, container, 'totalItems', root => {
        const currentContainer = getContainerFromRoot(root);
        return (currentContainer?.batches ?? []).reduce(
          (products, batch) => products.add(batch.orderItem.id),
          new Set()
        ).size;
      }),
    },
    {
      columnKey: 'container.totalPackages',
      type: 'number',
      ...transformComputedField(basePath, container, 'totalPackages', root => {
        const currentContainer = getContainerFromRoot(root);
        return (currentContainer?.batches ?? []).reduce(
          (total, batch) =>
            total +
            (batch.packageQuantity.auto
              ? calculatePackageQuantity(batch)
              : batch.packageQuantity.value || 0),
          0
        );
      }),
    },
    {
      columnKey: 'container.totalWeight',
      type: 'metric_value',
      ...transformComputedField(basePath, container, 'totalWeight', root => {
        const currentContainer = getContainerFromRoot(root);
        return {
          value: (currentContainer?.batches ?? []).reduce((total, batch) => {
            if (!batch.packageGrossWeight) {
              return total;
            }

            return (
              total +
              (batch.packageQuantity.auto
                ? calculatePackageQuantity(batch)
                : batch.packageQuantity.value || 0) *
                convertWeight(batch.packageGrossWeight.value, batch.packageGrossWeight.metric, 'kg')
            );
          }, 0),
          metric: 'kg',
        };
      }),
    },
    {
      columnKey: 'container.totalVolume',
      type: 'metric_value',
      ...transformComputedField(basePath, container, 'totalVolume', root => {
        const currentContainer = getContainerFromRoot(root);
        return {
          value: (currentContainer?.batches ?? []).reduce((total, batch) => {
            const packageVolume = batch.packageVolume.auto
              ? calculateVolume({ value: 0, metric: 'm³' }, batch.packageSize)
              : batch.packageVolume.value;

            if (!packageVolume) {
              return total;
            }

            return (
              total +
              (batch.packageQuantity.auto
                ? calculatePackageQuantity(batch)
                : batch.packageQuantity.value || 0) *
                convertVolume(packageVolume.value, packageVolume.metric, 'm³')
            );
          }, 0),
          metric: 'm³',
        };
      }),
    },
    {
      columnKey: 'container.logs',
      type: 'container_logs',
      ...transformValueField(basePath, container, 'id', () => true),
    },
    {
      columnKey: 'container.mask',
      type: 'mask',
      extra: { entityType: 'Container' },
      ...transformField(
        container,
        `${basePath}.customFields.mask`,
        'mask',
        container?.customFields?.mask ?? null,
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `container.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: (root: Object) => {
        const currentContainer = getContainerFromRoot(root);
        const mask = currentContainer?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        container,
        fieldDefinition.id,
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_CUSTOM_FIELDS)
      ),
    })),
  ];
}
