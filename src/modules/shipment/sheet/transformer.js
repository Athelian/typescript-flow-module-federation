// @flow
import {
  transformValueField,
  transformReadonlyField,
  transformComputedField,
} from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
/* import {
  ORDER_SET_ARCHIVED,
  ORDER_SET_CURRENCY,
  ORDER_SET_PO_NO,
  ORDER_SET_PI_NO,
  ORDER_SET_DELIVERY_PLACE,
  ORDER_UPDATE,
  ORDER_SET_DELIVERY_DATE,
  ORDER_SET_ISSUE_AT,
  ORDER_SET_INCOTERM,
  ORDER_SET_MEMO,
  ORDER_SET_DOCUMENTS,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_SET_NO,
  ORDER_ITEMS_SET_QUANTITY,
  ORDER_ITEMS_SET_PRICE,
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_DELIVERY_DATE,
  ORDER_ITEMS_SET_DOCUMENTS,
} from 'modules/permission/constants/orderItem'; */
import {
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_EXPIRY,
  BATCH_SET_NO,
  BATCH_SET_PACKAGE_CAPACITY,
  BATCH_SET_PACKAGE_NAME,
  BATCH_SET_PACKAGE_QUANTITY,
  BATCH_SET_PRODUCTION_DATE,
  BATCH_SET_QUANTITY,
  BATCH_SET_QUANTITY_ADJUSTMENTS,
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
} from 'modules/permission/constants/shipment';

function transformShipment(basePath: string, shipment: Object): Array<CellValue> {
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
      columnKey: 'shipment.forwarders',
      type: 'forwarders',
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
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        (shipment?.containers ?? []).length
          ? shipment?.containerGroups?.[0]?.warehouseArrival ?? null
          : null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        (shipment?.containers ?? []).length
          ? shipment?.containerGroups?.[0]?.warehouseArrival ?? null
          : null,
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
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        (shipment?.containers ?? []).length
          ? shipment?.containerGroups?.[0]?.warehouseArrival ?? null
          : null,
        'assignedTo',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_ASSIGN_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroup.warehouseArrival.approved',
      type: 'approval',
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        (shipment?.containers ?? []).length
          ? shipment?.containerGroups?.[0]?.warehouseArrival ?? null
          : null,
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
      ...transformComputedField(basePath, container, 'archived', item => {
        return item.archived ?? true;
      }),
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
    // start date
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
  ].map(c => ({
    ...c,
    disabled: !hasContainers && !container,
    empty: hasContainers && !container,
    parent: true,
  }));
}

function transformBatch(basePath: string, batch: Object): Array<CellValue> {
  return [
    {
      columnKey: 'shipment.container.batch.created',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'created', item => {
        const currentBatch = [
          ...item.batchesWithoutContainer,
          ...item.containers.map(c => c.batches).flat(),
        ].find(b => b.id === batch?.id);

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
      ...transformComputedField(basePath, batch, 'updated', item => {
        const currentBatch = [
          ...item.batchesWithoutContainer,
          ...item.containers.map(c => c.batches).flat(),
        ].find(b => b.id === batch?.id);

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
      ...transformComputedField(basePath, batch, 'archived', item => {
        const currentBatch = [
          ...item.batchesWithoutContainer,
          ...item.containers.map(c => c.batches).flat(),
        ].find(b => b.id === batch?.id);

        return item.archived && currentBatch.orderItem.order.archived;
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
      columnKey: 'shipment.container.batch.quantityRevisions',
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
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'packageQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_QUANTITY)
      ),
    },
  ].map(c => ({
    ...c,
    disabled: !batch,
  }));
}

/*
function transformBatchOrderItem(basePath: string, batch: Object): Array<CellValue> {
  return [].map(c => ({
    ...c,
  }));
}

function transformBatchOrderItemOrder(basePath: string, batch: Object): Array<CellValue> {
  return [].map(c => ({
    ...c,
  }));
}
*/

export default function transformer(index: number, shipment: Object): Array<Array<CellValue>> {
  const rows = [];

  let shipmentCells = transformShipment(`${index}`, shipment);

  shipment.batchesWithoutContainer.forEach((batch, batchIdx) => {
    rows.push([
      ...shipmentCells,
      ...transformContainer(`${index}.containers.-1`, null, false),
      ...transformBatch(`${index}.batchesWithoutContainer.${batchIdx}`, batch),
      // ...transformBatchOrderItem(`${index}.batchesWithoutContainer.${batchIdx}`, batch),
      // ...transformBatchOrderItemOrder(`${index}.batchesWithoutContainer.${batchIdx}`, batch),
    ]);

    shipmentCells = transformShipment(`${index}`, null);
  });

  if (shipment.containers.length > 0) {
    shipment.containers.forEach((container, containerIdx) => {
      let containerCells = transformContainer(
        `${index}.containers.${containerIdx}`,
        container,
        true
      );

      if (container.batches.length > 0) {
        container.batches.forEach((batch, batchIdx) => {
          rows.push([
            ...shipmentCells,
            ...containerCells,
            ...transformBatch(`${index}.containers.${containerIdx}.batches.${batchIdx}`, batch),
            // ...transformBatchOrderItem(
            //  `${index}.containers.${containerIdx}.batches.${batchIdx}`,
            //  batch
            // ),
            // ...transformBatchOrderItemOrder(
            //   `${index}.containers.${containerIdx}.batches.${batchIdx}`,
            //   batch
            // ),
          ]);

          containerCells = transformContainer(`${index}.containers.${containerIdx}`, null, true);
          shipmentCells = transformShipment(`${index}`, null);
        });
      } else {
        rows.push([
          ...shipmentCells,
          ...containerCells,
          ...transformBatch(`${index}.containers.${containerIdx}.batches.-1`, null),
          // ...transformBatchOrderItem(`${index}.containers.${containerIdx}.batches.-1`, null),
          // ...transformBatchOrderItemOrder(`${index}.containers.${containerIdx}.batches.-1`, null),
        ]);

        shipmentCells = transformShipment(`${index}`, null);
      }
    });
  } else if (shipment.batchesWithoutContainer.length === 0) {
    rows.push([
      ...shipmentCells,
      ...transformContainer(`${index}.containers.-1`, null, false),
      ...transformBatch(`${index}.containers.-1.batches.-1`, null),
      // ...transformBatchOrderItem(`${index}.containers.-1.batches.-1`, null),
      // ...transformBatchOrderItemOrder(`${index}.containers.-1.batches.-1`, null),
    ]);
  }

  return rows;
}
