// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { FieldDefinition } from 'types';
import { calculatePackageQuantity, calculateVolume, getBatchLatestQuantity } from 'utils/batch';
import { convertVolume, convertWeight } from 'utils/metric';
import type { CellValue } from 'components/Sheet/SheetState/types';
import { getLatestDate } from 'utils/shipment';
import { differenceInCalendarDays } from 'utils/date';
import {
  transformComputedField,
  transformCustomField,
  transformField,
  transformReadonlyField,
  transformValueField,
} from 'components/Sheet';
import { PARTNER_LIST } from 'modules/permission/constants/partner';
import {
  SHIPMENT_APPROVE_TIMELINE_DATE,
  SHIPMENT_ASSIGN_TIMELINE_DATE,
  SHIPMENT_SET_ARCHIVED,
  SHIPMENT_SET_BL_DATE,
  SHIPMENT_SET_BL_NO,
  SHIPMENT_SET_BOOKED,
  SHIPMENT_SET_BOOKING_DATE,
  SHIPMENT_SET_BOOKING_NO,
  SHIPMENT_SET_CARRIER,
  SHIPMENT_SET_CONTRACT_NO,
  SHIPMENT_SET_CUSTOM_FIELDS,
  SHIPMENT_SET_CUSTOM_FIELDS_MASK,
  SHIPMENT_SET_DOCUMENTS,
  SHIPMENT_SET_EXPORTER,
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
  SHIPMENT_SET_TOTAL_PACKAGE_QUANTITY,
  SHIPMENT_SET_TOTAL_VOLUME,
  SHIPMENT_SET_TOTAL_WEIGHT,
  SHIPMENT_SET_TRANSPORT_TYPE,
  SHIPMENT_SET_VESSEL_NAME,
  SHIPMENT_SET_WAREHOUSE,
  SHIPMENT_UPDATE,
} from 'modules/permission/constants/shipment';

type Props = {|
  fieldDefinitions: Array<FieldDefinition>,
  basePath: string,
  shipment: ?Object,
  getShipmentFromRoot: Object => ?Object,
  readonlyExporter: boolean,
|};

export default function transformSheetShipment({
  fieldDefinitions,
  basePath,
  shipment,
  getShipmentFromRoot,
  readonlyExporter,
}: Props): Array<CellValue> {
  const nbOfVoyages = (shipment?.voyages ?? []).length;
  const getBatchesFromRoot = root => {
    const currentShipment = getShipmentFromRoot(root);
    return [
      ...(currentShipment?.batchesWithoutContainer ?? []),
      // $FlowFixMe flow doesn't know flat
      ...(currentShipment?.containers ?? []).flatMap(c => c.batches),
    ];
  };

  return [
    {
      columnKey: 'shipment.created',
      type: 'date_user',
      ...transformComputedField(basePath, shipment, 'created', root => {
        const currentShipment = getShipmentFromRoot(root);
        return currentShipment
          ? {
              at: new Date(currentShipment.createdAt ?? ''),
              by: currentShipment.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, shipment, 'createdBy', shipment?.createdBy ?? null),
    },
    {
      columnKey: 'shipment.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, shipment, 'createdAt', shipment?.createdAt ?? null),
    },
    {
      columnKey: 'shipment.updated',
      type: 'date_user',
      ...transformComputedField(basePath, shipment, 'updated', root => {
        const currentShipment = getShipmentFromRoot(root);
        return currentShipment
          ? {
              at: new Date(currentShipment.updatedAt ?? ''),
              by: currentShipment.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, shipment, 'updatedBy', shipment?.updatedBy ?? null),
    },
    {
      columnKey: 'shipment.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, shipment, 'updatedAt', shipment?.updatedAt ?? null),
    },
    {
      columnKey: 'shipment.archived',
      type: 'status',
      ...transformValueField(
        basePath,
        shipment,
        'archived',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_ARCHIVED)
      ),
    },
    {
      columnKey: 'shipment.no',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'no',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_NO)
      ),
    },
    {
      columnKey: 'shipment.importer',
      type: 'partner',
      ...transformReadonlyField(basePath, shipment, 'importer', shipment?.importer ?? null),
    },
    readonlyExporter
      ? {
          columnKey: 'shipment.exporter',
          type: 'partner',
          ...transformReadonlyField(basePath, shipment, 'exporter', shipment?.exporter ?? null),
        }
      : {
          columnKey: 'shipment.exporter',
          type: 'main_exporter',
          ...transformValueField(
            basePath,
            shipment,
            'exporter',
            hasPermission =>
              hasPermission(PARTNER_LIST) &&
              (hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_EXPORTER))
          ),
        },
    {
      columnKey: 'shipment.relatedExporters',
      type: 'partners',
      ...transformComputedField(basePath, shipment, 'relatedExporters', root => {
        const currentShipment = getShipmentFromRoot(root);
        const exporters = new Map();

        (currentShipment?.batchesWithoutContainer ?? []).forEach(({ orderItem }) => {
          exporters.set(orderItem?.order?.exporter?.id, orderItem?.order?.exporter);
        });

        (currentShipment?.containers ?? []).forEach(({ batches = [] }) => {
          batches.forEach(({ orderItem }) => {
            exporters.set(orderItem?.order?.exporter?.id, orderItem?.order?.exporter);
          });
        });

        return Array.from(exporters.values()).filter(Boolean);
      }),
    },
    {
      columnKey: 'shipment.forwarders',
      type: 'partners',
      extra: { partnerTypes: ['Forwarder'] },
      ...transformValueField(
        basePath,
        shipment,
        'forwarders',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_FORWARDERS)
      ),
    },
    {
      columnKey: 'shipment.blNo',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'blNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_NO)
      ),
    },
    {
      columnKey: 'shipment.blDate',
      type: 'date',
      ...transformValueField(
        basePath,
        shipment,
        'blDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_DATE)
      ),
    },
    {
      columnKey: 'shipment.bookingNo',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'bookingNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_NO)
      ),
    },
    {
      columnKey: 'shipment.booked',
      type: 'booked',
      ...transformValueField(
        basePath,
        shipment,
        'booked',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKED)
      ),
    },
    {
      columnKey: 'shipment.bookingDate',
      type: 'date',
      ...transformValueField(
        basePath,
        shipment,
        'bookingDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_DATE)
      ),
    },
    {
      columnKey: 'shipment.invoiceNo',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'invoiceNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INVOICE_NO)
      ),
    },
    {
      columnKey: 'shipment.contractNo',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'contractNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CONTRACT_NO)
      ),
    },
    {
      columnKey: 'shipment.transportType',
      type: 'transport_type',
      ...transformValueField(
        basePath,
        shipment,
        'transportType',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TRANSPORT_TYPE)
      ),
    },
    {
      columnKey: 'shipment.loadType',
      type: 'load_type',
      ...transformValueField(
        basePath,
        shipment,
        'loadType',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_LOAD_TYPE)
      ),
    },
    {
      columnKey: 'shipment.incoterm',
      type: 'incoterm',
      ...transformValueField(
        basePath,
        shipment,
        'incoterm',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INCOTERM)
      ),
    },
    {
      columnKey: 'shipment.carrier',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'carrier',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CARRIER)
      ),
    },
    {
      columnKey: 'shipment.tags',
      type: 'shipment_tags',
      ...transformValueField(
        basePath,
        shipment,
        'tags',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TAGS)
      ),
    },
    {
      columnKey: 'shipment.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        shipment,
        'memo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_MEMO)
      ),
    },
    {
      columnKey: 'shipment.inCharges',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [
          currentShipment?.importer?.id,
          currentShipment?.exporter?.id,
          ...(currentShipment?.forwarders ?? []).map(f => f.id),
        ].filter(Boolean);
      },
      ...transformValueField(
        basePath,
        shipment,
        'inCharges',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_IN_CHARGE)
      ),
    },
    {
      columnKey: 'shipment.totalBatchQuantity',
      type: 'number',
      ...transformComputedField(basePath, shipment, 'totalBatchQuantity', root =>
        getBatchesFromRoot(root).reduce((total, batch) => total + getBatchLatestQuantity(batch), 0)
      ),
    },
    {
      columnKey: 'shipment.totalProducts',
      type: 'number',
      ...transformComputedField(
        basePath,
        shipment,
        'totalProducts',
        root =>
          getBatchesFromRoot(root).reduce(
            (products, batch) => products.add(batch.orderItem.productProvider.product.id),
            new Set()
          ).size
      ),
    },
    {
      columnKey: 'shipment.totalPrice',
      type: 'maskable_metric_value',
      extra: {
        message: (
          <FormattedMessage
            id="modules.Shipments.totalPriceInvalidMessage"
            defaultMessage="Cannot compute this field because this Shipment contains Cargo with different Currencies"
          />
        ),
      },
      ...transformComputedField(basePath, shipment, 'totalPrice', root => {
        const totalPrice = getBatchesFromRoot(root).reduce(
          (total, batch) => total + getBatchLatestQuantity(batch) * batch.orderItem.price.value,
          0
        );
        const currencies = getBatchesFromRoot(root).reduce(
          (list, batch) => list.add(batch.orderItem.price.metric),
          new Set()
        );

        if (currencies.size === 0) {
          return { value: 0, metric: '' };
        }

        if (currencies.size === 1) {
          return { value: totalPrice, metric: Array.from(currencies)[0] };
        }

        return null;
      }),
    },
    {
      columnKey: 'shipment.totalOrders',
      type: 'number',
      ...transformComputedField(
        basePath,
        shipment,
        'totalOrders',
        root =>
          getBatchesFromRoot(root).reduce(
            (orders, batch) => orders.add(batch.orderItem.order.id),
            new Set()
          ).size
      ),
    },
    {
      columnKey: 'shipment.totalBatches',
      type: 'number',
      ...transformComputedField(
        basePath,
        shipment,
        'totalBatches',
        root => getBatchesFromRoot(root).length
      ),
    },
    {
      columnKey: 'shipment.totalContainers',
      type: 'number',
      ...transformComputedField(basePath, shipment, 'totalContainers', root => {
        const currentShipment = getShipmentFromRoot(root);
        return (currentShipment?.container ?? []).length;
      }),
    },
    {
      columnKey: 'shipment.totalPackages',
      type: 'number_toggle',
      computed: root =>
        getBatchesFromRoot(root).reduce(
          (total, batch) =>
            total +
            (batch.packageQuantity.auto
              ? calculatePackageQuantity(batch)
              : batch.packageQuantity.value || 0),
          0
        ),
      ...transformValueField(
        basePath,
        shipment,
        'totalPackages',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TOTAL_PACKAGE_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.totalWeight',
      type: 'mass_overridable_toggle',
      computed: root => ({
        value: getBatchesFromRoot(root).reduce((total, batch) => {
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
      }),
      ...transformValueField(
        basePath,
        shipment,
        'totalWeight',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TOTAL_WEIGHT)
      ),
    },
    {
      columnKey: 'shipment.totalVolume',
      type: 'volume_overridable_toggle',
      computed: root => ({
        value: getBatchesFromRoot(root).reduce((total, batch) => {
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
      }),
      ...transformValueField(
        basePath,
        shipment,
        'totalVolume',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TOTAL_VOLUME)
      ),
    },
    {
      columnKey: 'shipment.numOfVoyages',
      type: 'number',
      ...transformComputedField(`${basePath}.shipment`, shipment, 'voyages', root => {
        const currentShipment = getShipmentFromRoot(root);
        return currentShipment?.voyages?.length ?? 0;
      }),
    },
    {
      columnKey: 'shipment.cargoReady.latestDate',
      type: 'date',
      ...transformComputedField(`${basePath}.shipment`, shipment, 'cargoReady.latestDate', root => {
        const currentShipment = getShipmentFromRoot(root);
        return getLatestDate(currentShipment?.cargoReady);
      }),
    },
    {
      columnKey: 'shipment.cargoReady.dateDifference',
      type: 'date_difference',
      ...transformComputedField(
        `${basePath}.shipment`,
        shipment,
        'cargoReady.dateDifference',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(currentShipment?.cargoReady);
          const initDate = currentShipment?.cargoReady?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.cargoReady.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.cargoReady`,
        shipment?.cargoReady ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.cargoReady`,
        shipment?.cargoReady ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.cargoReady`,
        shipment?.cargoReady ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.cargoReady`,
        shipment?.cargoReady ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departurePort',
      type: 'port',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return currentShipment?.transportType ?? null;
      },
      ...transformValueField(
        `${basePath}.voyages.0`,
        shipment?.voyages?.[0] ?? null,
        'departurePort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.latestDate',
      type: 'date',
      ...transformComputedField(
        `${basePath}.voyages.0.departure`,
        shipment?.voyages?.[0]?.departure ?? null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(currentShipment?.voyages?.[0]?.departure);
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.dateDifference',
      type: 'date_difference',
      ...transformComputedField(
        `${basePath}.voyages.0.departure`,
        shipment?.voyages?.[0]?.departure ?? null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(currentShipment?.voyages?.[0]?.departure);
          const initDate = currentShipment?.voyages?.[0]?.departure?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.voyages.0.departure`,
        shipment?.voyages?.[0]?.departure ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.voyages.0.departure`,
        shipment?.voyages?.[0]?.departure ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.voyages.0.departure`,
        shipment?.voyages?.[0]?.departure ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.departure.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.voyages.0.departure`,
        shipment?.voyages?.[0]?.departure ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.vesselName',
      type: 'text',
      ...transformValueField(
        `${basePath}.voyages.0`,
        shipment?.voyages?.[0] ?? null,
        'vesselName',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.vesselCode',
      type: 'text',
      ...transformValueField(
        `${basePath}.voyages.0`,
        shipment?.voyages?.[0] ?? null,
        'vesselCode',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitPort',
      type: 'port',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return currentShipment?.transportType ?? null;
      },
      ...transformValueField(
        `${basePath}.voyages.0`,
        nbOfVoyages > 1 ? shipment?.voyages?.[0] ?? null : null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.latestDate',
      type: 'date',
      ...transformComputedField(
        `${basePath}.voyages.0.arrival`,
        shipment?.voyages?.[0]?.arrival ?? null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(currentShipment?.voyages?.[0]?.arrival);
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.dateDifference',
      type: 'date_difference',
      ...transformComputedField(
        `${basePath}.voyages.0.arrival`,
        shipment?.voyages?.[0]?.arrival ?? null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(currentShipment?.voyages?.[0]?.arrival);
          const initDate = currentShipment?.voyages?.[0]?.arrival?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.voyages.0.arrival`,
        nbOfVoyages > 1 ? shipment?.voyages?.[0]?.arrival ?? null : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.voyages.0.arrival`,
        nbOfVoyages > 1 ? shipment?.voyages?.[0]?.arrival ?? null : null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.voyages.0.arrival`,
        nbOfVoyages > 1 ? shipment?.voyages?.[0]?.arrival ?? null : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.0.firstTransitArrival.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.voyages.0.arrival`,
        nbOfVoyages > 1 ? shipment?.voyages?.[0]?.arrival ?? null : null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.latestDate',
      type: 'date',
      ...transformComputedField(
        `${basePath}.voyages.1.departure`,
        shipment?.voyages?.[1]?.departure ?? null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(currentShipment?.voyages?.[1]?.departure);
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.dateDifference',
      type: 'date_difference',
      ...transformComputedField(
        `${basePath}.voyages.1.departure`,
        shipment?.voyages?.[1]?.departure ?? null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(currentShipment?.voyages?.[1]?.departure);
          const initDate = currentShipment?.voyages?.[1]?.departure?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.voyages.1.departure`,
        nbOfVoyages > 1 ? shipment?.voyages?.[1]?.departure ?? null : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.voyages.1.departure`,
        nbOfVoyages > 1 ? shipment?.voyages?.[1]?.departure ?? null : null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.voyages.1.departure`,
        nbOfVoyages > 1 ? shipment?.voyages?.[1]?.departure ?? null : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.firstTransitDeparture.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.voyages.1.departure`,
        nbOfVoyages > 1 ? shipment?.voyages?.[1]?.departure ?? null : null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.vesselName',
      type: 'text',
      ...transformValueField(
        `${basePath}.voyages.1`,
        shipment?.voyages?.[1] ?? null,
        'vesselName',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.vesselCode',
      type: 'text',
      ...transformValueField(
        `${basePath}.voyages.1`,
        shipment?.voyages?.[1] ?? null,
        'vesselCode',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitPort',
      type: 'port',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return currentShipment?.transportType ?? null;
      },
      ...transformValueField(
        `${basePath}.voyages.1`,
        nbOfVoyages > 2 ? shipment?.voyages?.[1] ?? null : null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.latestDate',
      type: 'date',
      ...transformComputedField(
        `${basePath}.voyages.1.arrival`,
        nbOfVoyages > 2 ? shipment?.voyages?.[1]?.arrival ?? null : null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(currentShipment?.voyages?.[1]?.arrival);
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.dateDifference',
      type: 'date_difference',
      ...transformComputedField(
        `${basePath}.voyages.1.arrival`,
        nbOfVoyages > 2 ? shipment?.voyages?.[1]?.arrival ?? null : null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(currentShipment?.voyages?.[1]?.arrival);
          const initDate = currentShipment?.voyages?.[1]?.arrival?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.voyages.1.arrival`,
        nbOfVoyages > 2 ? shipment?.voyages?.[1]?.arrival ?? null : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.voyages.1.arrival`,
        nbOfVoyages > 2 ? shipment?.voyages?.[1]?.arrival ?? null : null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.voyages.1.arrival`,
        nbOfVoyages > 2 ? shipment?.voyages?.[1]?.arrival ?? null : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.1.secondTransitArrival.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.voyages.1.arrival`,
        nbOfVoyages > 2 ? shipment?.voyages?.[1]?.arrival ?? null : null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.latestDate',
      type: 'date',
      ...transformComputedField(
        `${basePath}.voyages.2.departure`,
        nbOfVoyages > 2 ? shipment?.voyages?.[2]?.departure ?? null : null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(currentShipment?.voyages?.[2]?.departure);
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.dateDifference',
      type: 'date_difference',
      ...transformComputedField(
        `${basePath}.voyages.2.departure`,
        nbOfVoyages > 2 ? shipment?.voyages?.[2]?.departure ?? null : null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(currentShipment?.voyages?.[2]?.departure);
          const initDate = currentShipment?.voyages?.[2]?.departure?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.voyages.2.departure`,
        nbOfVoyages > 2 ? shipment?.voyages?.[2]?.departure ?? null : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.voyages.2.departure`,
        nbOfVoyages > 2 ? shipment?.voyages?.[2]?.departure ?? null : null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.voyages.2.departure`,
        nbOfVoyages > 2 ? shipment?.voyages?.[2]?.departure ?? null : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.secondTransitDeparture.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.voyages.2.departure`,
        nbOfVoyages > 2 ? shipment?.voyages?.[2]?.departure ?? null : null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.vesselName',
      type: 'text',
      ...transformValueField(
        `${basePath}.voyages.2`,
        shipment?.voyages?.[2] ?? null,
        'vesselName',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.vesselCode',
      type: 'text',
      ...transformValueField(
        `${basePath}.voyages.2`,
        shipment?.voyages?.[2] ?? null,
        'vesselCode',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_VESSEL_NAME)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrivalPort',
      type: 'port',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return currentShipment?.transportType ?? null;
      },
      ...transformValueField(
        `${basePath}.voyages.${(shipment?.voyages?.length ?? 0) - 1}`,
        shipment?.voyages?.[(shipment?.voyages?.length ?? 0) - 1] ?? null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.latestDate',
      type: 'date',
      ...transformComputedField(
        `${basePath}.voyages.${(shipment?.voyages?.length ?? 0) - 1}.arrival`,
        shipment?.voyages?.[(shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(
            currentShipment?.voyages?.[(currentShipment?.voyages?.length ?? 0) - 1]?.arrival
          );
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.dateDifference',
      type: 'date_difference',
      ...transformComputedField(
        `${basePath}.voyages.${(shipment?.voyages?.length ?? 0) - 1}.arrival`,
        shipment?.voyages?.[(shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(
            currentShipment?.voyages?.[(currentShipment?.voyages?.length ?? 0) - 1]?.arrival
          );
          const initDate =
            currentShipment?.voyages?.[(currentShipment?.voyages?.length ?? 0) - 1]?.arrival?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.voyages.${(shipment?.voyages?.length ?? 0) - 1}.arrival`,
        shipment?.voyages?.[(shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.voyages.${(shipment?.voyages?.length ?? 0) - 1}.arrival`,
        shipment?.voyages?.[(shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.voyages.${(shipment?.voyages?.length ?? 0) - 1}.arrival`,
        shipment?.voyages?.[(shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.voyage.2.arrival.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.voyages.${(shipment?.voyages?.length ?? 0) - 1}.arrival`,
        shipment?.voyages?.[(shipment?.voyages?.length ?? 0) - 1]?.arrival ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.latestDate',
      type: 'date',
      ...transformComputedField(
        `${basePath}.containerGroups.0.customClearance`,
        shipment?.containerGroups?.[0]?.customClearance ?? null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(currentShipment?.containerGroups?.[0]?.customClearance);
        }
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.dateDifference',
      type: 'date_difference',
      ...transformComputedField(
        `${basePath}.containerGroups.0.customClearance`,
        shipment?.containerGroups?.[0]?.customClearance ?? null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(currentShipment?.containerGroups?.[0]?.customClearance);
          const initDate =
            currentShipment?.currentShipment?.containerGroups?.[0]?.customClearance?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.containerGroups.0.customClearance`,
        shipment?.containerGroups?.[0]?.customClearance ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.containerGroups.0.customClearance`,
        shipment?.containerGroups?.[0]?.customClearance ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.containerGroups.0.customClearance`,
        shipment?.containerGroups?.[0]?.customClearance ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.customClearance.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.containerGroups.0.customClearance`,
        shipment?.containerGroups?.[0]?.customClearance ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouse',
      type: 'warehouse',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformValueField(
        `${basePath}.containerGroups.0`,
        shipment?.containerGroups?.[0] ?? null,
        'warehouse',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_WAREHOUSE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.latestDate',
      type: 'date',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformComputedField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(currentShipment?.containerGroups?.[0]?.warehouseArrival);
        }
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.dateDifference',
      type: 'date_difference',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformComputedField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(
            currentShipment?.containerGroups?.[0]?.warehouseArrival
          );
          const initDate =
            currentShipment?.currentShipment?.containerGroups?.[0]?.warehouseArrival?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.date',
      type: 'date',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.timelineDateRevisions',
      type: 'date_revisions',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.approved',
      type: 'approval',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.latestDate',
      type: 'date',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformComputedField(
        `${basePath}.containerGroups.0.deliveryReady`,
        shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'currentDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          return getLatestDate(currentShipment?.containerGroups?.[0]?.deliveryReady);
        }
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.dateDifference',
      type: 'date_difference',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        if (currentShipment?.containers) {
          return (currentShipment?.containers ?? []).length > 0;
        }

        return (currentShipment?.containerCount ?? 0) > 0;
      },
      ...transformComputedField(
        `${basePath}.containerGroups.0.deliveryReady`,
        shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'differenceDate',
        root => {
          const currentShipment = getShipmentFromRoot(root);
          const currentDate = getLatestDate(currentShipment?.containerGroups?.[0]?.deliveryReady);
          const initDate =
            currentShipment?.currentShipment?.containerGroups?.[0]?.deliveryReady?.date;
          if (!initDate || !currentDate) return 0;

          return differenceInCalendarDays(new Date(currentDate), new Date(initDate));
        }
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.containerGroups.0.deliveryReady`,
        shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.containerGroups.0.deliveryReady`,
        shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.assignedTo',
      type: 'user_assignment',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return [currentShipment?.importer?.id, currentShipment?.exporter?.id].filter(Boolean);
      },
      ...transformValueField(
        `${basePath}.containerGroups.0.deliveryReady`,
        shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.deliveryReady.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.containerGroups.0.deliveryReady`,
        shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.files',
      type: 'shipment_documents',
      ...transformValueField(
        basePath,
        shipment,
        'files',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_DOCUMENTS)
      ),
    },
    {
      columnKey: 'shipment.todo',
      type: 'shipment_tasks',
      computed: root => {
        const currentShipment = getShipmentFromRoot(root);
        return {
          entityId: shipment?.id ?? null,
          ownerId: shipment?.ownedBy?.id,
          groupIds: [
            currentShipment?.importer?.id,
            currentShipment?.exporter?.id,
            ...(currentShipment?.forwarders ?? []).map(f => f.id),
          ].filter(Boolean),
        };
      },
      ...transformValueField(
        basePath,
        shipment,
        'todo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TASKS)
      ),
    },
    {
      columnKey: 'shipment.logs',
      type: 'shipment_logs',
      ...transformValueField(basePath, shipment, 'id', () => true),
    },
    {
      columnKey: 'shipment.mask',
      type: 'mask',
      extra: { entityType: 'Shipment' },
      ...transformField(
        shipment,
        `${basePath}.customFields.mask`,
        'mask',
        shipment?.customFields?.mask ?? null,
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CUSTOM_FIELDS_MASK)
      ),
    },
    ...fieldDefinitions.map(fieldDefinition => ({
      columnKey: `shipment.customField.${fieldDefinition.id}`,
      type: 'text',
      hide: root => {
        const currentShipment = getShipmentFromRoot(root);
        const mask = currentShipment?.customFields?.mask ?? null;
        return !!mask && !mask.fieldDefinitions.find(fd => fd.id === fieldDefinition.id);
      },
      ...transformCustomField(
        basePath,
        shipment,
        fieldDefinition.id,
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CUSTOM_FIELDS)
      ),
    })),
  ];
}
