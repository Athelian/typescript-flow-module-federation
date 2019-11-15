// @flow
import { addDays, differenceInCalendarDays } from 'date-fns';
import { calculateDueDate, startOfToday } from 'utils/date';
import { getLatestDate } from 'utils/shipment';
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
import { PARTNER_LIST } from 'modules/permission/constants/partner';
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
import {
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_DEPARTURE_DATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_YARD_NAME,
  CONTAINER_UPDATE,
  CONTAINER_SET_CONTAINER_TYPE,
  CONTAINER_SET_CONTAINER_OPTION,
  CONTAINER_ASSIGN_AGREE_ARRIVAL_DATE,
  CONTAINER_APPROVE_AGREE_ARRIVAL_DATE,
  CONTAINER_ASSIGN_ACTUAL_ARRIVAL_DATE,
  CONTAINER_APPROVE_ACTUAL_ARRIVAL_DATE,
  CONTAINER_SET_WAREHOUSE,
  CONTAINER_SET_FREE_TIME_START_DATE,
  CONTAINER_SET_FREE_TIME_DURATION,
  CONTAINER_ASSIGN_DEPARTURE_DATE,
  CONTAINER_APPROVE_DEPARTURE_DATE,
  CONTAINER_SET_TAGS,
  CONTAINER_SET_MEMO,
} from 'modules/permission/constants/container';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_SET_ARCHIVED,
  SHIPMENT_SET_NO,
  SHIPMENT_SET_BL_NO,
  SHIPMENT_SET_BL_DATE,
  SHIPMENT_SET_BOOKING_NO,
  SHIPMENT_SET_BOOKING_DATE,
  SHIPMENT_SET_INVOICE_NO,
  SHIPMENT_SET_CONTRACT_NO,
  SHIPMENT_SET_CARRIER,
  SHIPMENT_SET_DOCUMENTS,
  SHIPMENT_SET_REVISE_TIMELINE_DATE,
  SHIPMENT_SET_TIMELINE_DATE,
  SHIPMENT_SET_TRANSPORT_TYPE,
  SHIPMENT_SET_LOAD_TYPE,
  SHIPMENT_SET_INCOTERM,
  SHIPMENT_SET_IN_CHARGE,
  SHIPMENT_SET_FORWARDERS,
  SHIPMENT_SET_BOOKED,
  SHIPMENT_SET_TAGS,
  SHIPMENT_SET_MEMO,
  SHIPMENT_ASSIGN_TIMELINE_DATE,
  SHIPMENT_APPROVE_TIMELINE_DATE,
  SHIPMENT_SET_PORT,
  SHIPMENT_SET_VESSEL_NAME,
  SHIPMENT_SET_WAREHOUSE,
  SHIPMENT_SET_TASKS,
  SHIPMENT_SET_EXPORTER,
  SHIPMENT_SET_CUSTOM_FIELDS,
  SHIPMENT_SET_CUSTOM_FIELDS_MASK,
} from 'modules/permission/constants/shipment';

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
  const nbOfVoyages = (shipment?.voyages ?? []).length;

  return [
    {
      columnKey: 'shipment.created',
      type: 'date_user',
      ...transformComputedField(basePath, shipment, 'created', item =>
        item
          ? {
              at: new Date(item.createdAt),
              by: item.createdBy,
            }
          : null
      ),
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
      ...transformComputedField(basePath, shipment, 'updated', item =>
        item
          ? {
              at: new Date(item.updatedAt),
              by: item.updatedBy,
            }
          : null
      ),
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
    {
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
      ...transformComputedField(basePath, shipment, 'relatedExporters', () => {
        const { batchesWithoutContainer = [], containers = [] } = shipment;
        const exporters = [];
        batchesWithoutContainer.forEach(({ orderItem }) => {
          if (!exporters.includes(orderItem?.order?.exporter)) {
            exporters.push(orderItem?.order?.exporter);
          }
        });
        containers.forEach(({ batches = [] }) => {
          batches.forEach(({ orderItem }) => {
            if (!exporters.includes(orderItem?.order?.exporter)) {
              exporters.push(orderItem?.order?.exporter);
            }
          });
        });

        return exporters.filter(Boolean);
      }),
    },
    {
      columnKey: 'shipment.inCharges',
      type: 'user_assignment',
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
      ...transformValueField(
        basePath,
        shipment,
        'inCharges',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_IN_CHARGE)
      ),
    },
    {
      columnKey: 'shipment.numOfVoyages',
      type: 'number',
      ...transformComputedField(basePath, shipment, 'voyages', item => {
        return item?.voyages?.length ?? 0;
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      computed: item => item.transportType,
      ...transformValueField(
        `${basePath}.voyages.0`,
        shipment?.voyages?.[0] ?? null,
        'departurePort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      computed: item => item.transportType,
      ...transformValueField(
        `${basePath}.voyages.0`,
        nbOfVoyages > 1 ? shipment?.voyages?.[0] ?? null : null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      computed: item => item.transportType,
      ...transformValueField(
        `${basePath}.voyages.1`,
        nbOfVoyages > 2 ? shipment?.voyages?.[1] ?? null : null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      computed: item => item.transportType,
      ...transformValueField(
        `${basePath}.voyages.${(shipment?.voyages?.length ?? 0) - 1}`,
        shipment?.voyages?.[(shipment?.voyages?.length ?? 0) - 1] ?? null,
        'arrivalPort',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_PORT)
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      ...transformValueField(
        `${basePath}.containerGroups.0`,
        shipment?.containerGroups?.[0] ?? null,
        'warehouse',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_WAREHOUSE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.date',
      type: 'date',
      hide: currentShipment => currentShipment.containers.length > 0,
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
      hide: currentShipment => currentShipment.containers.length > 0,
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
      hide: currentShipment => currentShipment.containers.length > 0,
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
      hide: currentShipment => currentShipment.containers.length > 0,
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'approved',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_APPROVE_TIMELINE_DATE)
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
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
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
      computed: item => ({
        entityId: shipment?.id ?? null,
        ownerId: item.ownedBy?.id,
        groupIds: [
          item.importer?.id,
          item.exporter?.id,
          ...(item.forwarders ?? []).map(f => f.id),
        ].filter(Boolean),
      }),
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
      hide: currentShipment => {
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
  ].map(c => ({
    ...c,
    empty: !shipment,
    parent: true,
  }));
}

function transformContainer(
  basePath: string,
  container: Object,
  hasContainers: boolean
): Array<CellValue> {
  return [
    {
      columnKey: 'shipment.container.created',
      type: 'date_user',
      ...transformComputedField(basePath, container, 'created', item => {
        const currentContainer = item.containers.find(c => c.id === container?.id);

        return currentContainer
          ? {
              at: new Date(currentContainer?.createdAt),
              by: currentContainer?.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.container.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'createdBy', container?.createdBy ?? null),
    },
    {
      columnKey: 'shipment.container.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'createdAt', container?.createdAt ?? null),
    },
    {
      columnKey: 'shipment.container.updated',
      type: 'date_user',
      ...transformComputedField(basePath, container, 'updated', item => {
        const currentContainer = item.containers.find(c => c.id === container?.id);

        return currentContainer
          ? {
              at: new Date(currentContainer?.updatedAt),
              by: currentContainer?.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.container.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'updatedBy', container?.updatedBy ?? null),
    },
    {
      columnKey: 'shipment.container.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'updatedAt', container?.updatedAt ?? null),
    },
    {
      columnKey: 'shipment.container.archived',
      type: 'status',
      ...transformComputedField(basePath, container, 'archived', item => item.archived ?? true),
    },
    {
      columnKey: 'shipment.container.no',
      type: 'text',
      ...transformValueField(
        basePath,
        container,
        'no',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_NO)
      ),
    },
    {
      columnKey: 'shipment.container.containerType',
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
      columnKey: 'shipment.container.containerOption',
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
      columnKey: 'shipment.container.warehouseArrivalAgreedDate',
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
      columnKey: 'shipment.container.warehouseArrivalAgreedDateAssignedTo',
      type: 'user_assignment',
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
      ...transformValueField(
        basePath,
        container,
        'warehouseArrivalAgreedDateAssignedTo',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_ASSIGN_AGREE_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.warehouseArrivalAgreedDateApproved',
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
      columnKey: 'shipment.container.warehouseArrivalActualDate',
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
      columnKey: 'shipment.container.warehouseArrivalActualDateAssignedTo',
      type: 'user_assignment',
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
      ...transformValueField(
        basePath,
        container,
        'warehouseArrivalActualDateAssignedTo',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_ASSIGN_ACTUAL_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.warehouseArrivalActualDateApproved',
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
      columnKey: 'shipment.container.warehouse',
      type: 'warehouse',
      ...transformValueField(
        basePath,
        container,
        'warehouse',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_WAREHOUSE)
      ),
    },
    {
      columnKey: 'shipment.container.freeTime',
      type: 'text',
      ...transformComputedField(basePath, container, 'freeTime', shipment => {
        const currentContainer = shipment.containers.find(c => c.id === container?.id);
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
      columnKey: 'shipment.container.freeTimeStartDate',
      type: 'date_toggle',
      computed: shipment => {
        const currentContainer = shipment.containers.find(c => c.id === container?.id);
        const auto = currentContainer?.autoCalculatedFreeTimeStartDate ?? false;
        return auto ? getLatestDate(shipment.voyages[shipment.voyages.length - 1]?.arrival) : null;
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
      columnKey: 'shipment.container.freeTimeDuration',
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
      columnKey: 'shipment.container.dueDate',
      type: 'date',
      ...transformComputedField(basePath, container, 'dueDate', shipment => {
        const currentContainer = shipment.containers.find(c => c.id === container?.id);
        const date = currentContainer?.freeTimeStartDate?.value;
        return date ? addDays(new Date(date), currentContainer?.freeTimeDuration ?? 0) : null;
      }),
    },
    {
      columnKey: 'shipment.container.yardName',
      type: 'text',
      ...transformValueField(
        basePath,
        container,
        'yardName',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_YARD_NAME)
      ),
    },
    {
      columnKey: 'shipment.container.departureDate',
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
      columnKey: 'shipment.container.departureDateAssignedTo',
      type: 'user_assignment',
      computed: item =>
        [item.importer?.id, item.exporter?.id, ...item.forwarders.map(f => f.id)].filter(Boolean),
      ...transformValueField(
        basePath,
        container,
        'departureDateAssignedTo',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_ASSIGN_DEPARTURE_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.departureDateApproved',
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
      columnKey: 'shipment.container.tags',
      type: 'container_tags',
      ...transformValueField(
        basePath,
        container,
        'tags',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_TAGS)
      ),
    },
    {
      columnKey: 'shipment.container.memo',
      type: 'textarea',
      ...transformValueField(
        basePath,
        container,
        'memo',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_MEMO)
      ),
    },
    {
      columnKey: 'shipment.container.logs',
      type: 'container_logs',
      ...transformValueField(basePath, container, 'id', () => true),
    },
  ].map(c => ({
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
