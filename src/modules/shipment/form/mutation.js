// @flow
import gql from 'graphql-tag';
import {
  shipmentFormFragment,
  shipmentContainerCardFragment,
  timelineDateFullFragment,
  batchFormFragment,
  userAvatarFragment,
  metricFragment,
  sizeFragment,
  tagFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  documentFragment,
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
  ownedByFragment,
} from 'graphql';

import { prepareCustomFieldsData } from 'utils/customFields';
import { prepareUpdateBatchInput } from 'modules/batch/form/mutation';
import { prepareContainer } from 'modules/container/form/mutation';
import { getBatchesInPool } from 'modules/shipment/helpers';
import { cleanUpData } from 'utils/data';
import type {
  CargoReady,
  ShipmentVoyage,
  ShipmentGroups,
  ShipmentCreate,
  ShipmentUpdate,
} from '../type.js.flow';

export const formatTimeline = (timeline: Object): ?CargoReady => {
  if (!timeline) return null;

  const { assignedTo = [], memo, approvedBy, date, timelineDateRevisions = [] } = timeline;

  return {
    memo,
    date: date ? new Date(date) : null,
    assignedToIds: assignedTo.map(({ id }) => id),
    timelineDateRevisions: timelineDateRevisions
      .filter(item => item && (item.date || item.memo))
      .map(({ id, date: dateRevision, type, memo: memoRevision }) => ({
        id: id && id.includes('-') ? null : id,
        type,
        memo: memoRevision,
        date: dateRevision ? new Date(dateRevision) : null,
      })),
    approvedById: approvedBy && approvedBy.id,
  };
};

export const formatVoyages = (voyages: Array<Object>): Array<ShipmentVoyage> =>
  voyages.map(({ id, departure, arrival, arrivalPort, departurePort, vesselName, vesselCode }) => ({
    ...(id && id.includes('-') ? {} : { id }),
    vesselCode,
    vesselName,
    departurePort: !departurePort
      ? null
      : {
          airport: departurePort && departurePort.airport ? departurePort.airport : null,
          seaport: departurePort && departurePort.seaport ? departurePort.seaport : null,
        },
    departure: !departure ? null : formatTimeline(departure),
    arrivalPort: !arrivalPort
      ? null
      : {
          airport: arrivalPort && arrivalPort.airport ? arrivalPort.airport : null,
          seaport: arrivalPort && arrivalPort.seaport ? arrivalPort.seaport : null,
        },
    arrival: !arrival ? null : formatTimeline(arrival),
  }));

export const formatContainerGroups = (voyages: Array<Object>): Array<ShipmentGroups> =>
  voyages.map(({ id, warehouse, customClearance, warehouseArrival, deliveryReady }) => ({
    ...(id && id.includes('-') ? {} : { id }),
    warehouseId: warehouse && warehouse.id,
    customClearance: !customClearance ? null : formatTimeline(customClearance),
    warehouseArrival: !warehouseArrival ? null : formatTimeline(warehouseArrival),
    deliveryReady: !deliveryReady ? null : formatTimeline(deliveryReady),
  }));

export const createShipmentMutation: Object = gql`
  mutation shipmentCreate($input: ShipmentCreateInput!) {
    shipmentCreate(input: $input) {
      ... on Shipment {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const createShipmentWithReturnDataMutation: Object = gql`
  mutation shipmentCreate($input: ShipmentCreateInput!) {
    shipmentCreate(input: $input) {
      ...shipmentFormFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${shipmentFormFragment}
  ${timelineDateFullFragment}
  ${batchFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${documentFragment}
  ${partnerCardFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
`;

export const prepareCreateShipmentInput = ({
  no,
  blNo,
  blDate,
  bookingNo,
  bookingDate,
  invoiceNo,
  loadType,
  transportType,
  incoterm,
  carrier,
  customFields,
  memo,
  cargoReady,
  voyages = [],
  containerGroups = [],
  tags = [],
  batches = [],
  importer,
  forwarders = [],
  inCharges = [],
  files = [],
  containers = [],
}: Object): ShipmentCreate => ({
  no,
  blNo,
  blDate: blDate ? new Date(blDate) : null,
  bookingNo,
  bookingDate: bookingDate ? new Date(bookingDate) : null,
  invoiceNo,
  memo,
  loadType: loadType && loadType.length > 0 ? loadType : null,
  transportType: transportType && transportType.length > 0 ? transportType : null,
  incoterm: incoterm && incoterm.length > 0 ? incoterm : null,
  carrier,
  customFields: prepareCustomFieldsData(customFields),
  cargoReady: formatTimeline(cargoReady),
  tagIds: tags.map(({ id }) => id),
  importerId: importer && importer.id,
  forwarderIds: forwarders.map(({ id }) => id),
  inChargeIds: inCharges.map(({ id }) => id),
  voyages: formatVoyages(voyages),
  batches: getBatchesInPool(batches).map(batch =>
    prepareUpdateBatchInput(cleanUpData(batch), true, false)
  ),
  containers: containers.map(prepareContainer),
  containerGroups: formatContainerGroups(containerGroups),
  files: files.map(({ id, name, type, memo: fileMemo }) => ({
    id,
    name,
    type,
    memo: fileMemo,
  })),
});

export const updateShipmentMutation: Object = gql`
  mutation shipmentUpdate($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentUpdate(id: $id, input: $input) {
      ...shipmentFormFragment
      ...badRequestFragment
    }
  }

  ${shipmentFormFragment}
  ${shipmentContainerCardFragment}
  ${timelineDateFullFragment}
  ${batchFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${documentFragment}
  ${partnerCardFragment}
  ${badRequestFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
`;

export const prepareUpdateShipmentInput = ({
  no,
  blNo,
  blDate,
  bookingNo,
  bookingDate,
  invoiceNo,
  memo,
  loadType,
  transportType,
  incoterm,
  carrier,
  customFields,
  cargoReady,
  voyages = [],
  containerGroups = [],
  tags = [],
  batches = [],
  forwarders = [],
  inCharges = [],
  files = [],
  containers = [],
}: Object): ShipmentUpdate => ({
  no,
  blNo,
  blDate: blDate ? new Date(blDate) : null,
  bookingNo,
  bookingDate: bookingDate ? new Date(bookingDate) : null,
  invoiceNo,
  memo,
  loadType: loadType && loadType.length > 0 ? loadType : null,
  transportType: transportType && transportType.length > 0 ? transportType : null,
  incoterm: incoterm && incoterm.length > 0 ? incoterm : null,
  carrier,
  customFields: prepareCustomFieldsData(customFields),
  cargoReady: formatTimeline(cargoReady),
  tagIds: tags.map(({ id }) => id),
  forwarderIds: forwarders.map(({ id }) => id),
  inChargeIds: inCharges.map(({ id }) => id),
  batches: getBatchesInPool(batches).map(batch =>
    prepareUpdateBatchInput(cleanUpData(batch), true, false)
  ),
  containers: containers.map(prepareContainer),
  voyages: formatVoyages(voyages),
  containerGroups: formatContainerGroups(containerGroups),
  files: files.map(({ id, name, type, memo: fileMemo }) => ({
    id,
    name,
    type,
    memo: fileMemo,
  })),
});
