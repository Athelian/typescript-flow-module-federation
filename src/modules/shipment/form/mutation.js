// @flow
import gql from 'graphql-tag';
import { findIndex } from 'lodash';
import {
  shipmentFormFragment,
  containerFormFragment,
  warehouseCardFragment,
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
import { isEquals, getByPathWithDefault } from 'utils/fp';
import {
  prepareUpdateBatchInput,
  prepareParsedUpdateBatchInput,
} from 'modules/batch/form/mutation';
import {
  prepareContainer,
  prepareParsedUpdateContainerInput,
} from 'modules/container/form/mutation';
import { getBatchesInPool } from 'modules/shipment/helpers';
import {
  cleanUpData,
  parseGenericField,
  parseDateField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseArrayOfChildrenField,
  parseApprovalField,
  parseFilesField,
  parseEnumField,
  parseCustomFieldsField,
} from 'utils/data';
import type {
  CargoReady,
  ShipmentVoyage,
  ShipmentGroups,
  ShipmentCreate,
  ShipmentUpdate,
} from '../type.js.flow';

const prepareNewContainer = ({
  updatedAt,
  updatedBy,
  archived,
  totalBatchPackages,
  totalBatchQuantity,
  totalNumberOfUniqueOrderItems,
  totalVolume,
  totalWeight,
  totalPrice,
  shipment,
  tags,
  warehouse,
  warehouseArrivalAgreedDate,
  warehouseArrivalActualDate,
  warehouseArrivalAgreedDateApprovedAt,
  warehouseArrivalActualDateApprovedAt,
  warehouseArrivalAgreedDateApprovedBy,
  warehouseArrivalActualDateApprovedBy,
  warehouseArrivalAgreedDateAssignedTo,
  warehouseArrivalActualDateAssignedTo,
  totalAdjusted,
  batches,
  representativeBatch,
  ownedBy,
  isNew,
  id,
  ...rest
}: Object) => ({
  ...rest,
  ...(isNew ? {} : { id }),
  warehouseId: warehouse && warehouse.id,
  warehouseArrivalAgreedDate: warehouseArrivalAgreedDate
    ? new Date(warehouseArrivalAgreedDate)
    : null,
  warehouseArrivalActualDate: warehouseArrivalActualDate
    ? new Date(warehouseArrivalActualDate)
    : null,
  warehouseArrivalAgreedDateApprovedById:
    warehouseArrivalAgreedDateApprovedBy && warehouseArrivalAgreedDateApprovedBy.id,
  warehouseArrivalActualDateApprovedById:
    warehouseArrivalActualDateApprovedBy && warehouseArrivalActualDateApprovedBy.id,
  ...(Array.isArray(warehouseArrivalAgreedDateAssignedTo) &&
  warehouseArrivalAgreedDateAssignedTo.length > 0
    ? {
        warehouseArrivalAgreedDateAssignedToIds: warehouseArrivalAgreedDateAssignedTo.map(
          item => item.id
        ),
      }
    : {}),
  ...(Array.isArray(warehouseArrivalActualDateAssignedTo) &&
  warehouseArrivalActualDateAssignedTo.length > 0
    ? {
        warehouseArrivalActualDateAssignedToIds: warehouseArrivalActualDateAssignedTo.map(
          item => item.id
        ),
      }
    : {}),
  ...(Array.isArray(batches) && batches.length > 0
    ? { batches: batches.map(batch => prepareUpdateBatchInput(cleanUpData(batch), true, false)) }
    : {}),
  ...(Array.isArray(tags) && tags.length > 0 ? { tagIds: tags.map(item => item.id) } : {}),
  representativeBatchIndex: representativeBatch
    ? findIndex(batches, batch => batch.id === representativeBatch.id)
    : null,
});

export const formatTimeline = (timeline: Object): ?CargoReady => {
  if (!timeline) return null;

  const { assignedTo, memo, approvedBy, date, timelineDateRevisions } = timeline;

  return {
    memo,
    date: date ? new Date(date) : null,
    ...(Array.isArray(assignedTo) ? { assignedToIds: assignedTo.map(({ id }) => id) } : {}),
    ...(Array.isArray(timelineDateRevisions)
      ? {
          timelineDateRevisions: timelineDateRevisions
            .filter(item => item && (item.date || item.memo))
            .map(({ id, date: dateRevision, type, memo: memoRevision }) => ({
              id: id && id.includes('-') ? null : id,
              type,
              memo: memoRevision,
              date: dateRevision ? new Date(dateRevision) : null,
            })),
        }
      : {}),
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

  ${shipmentFormFragment}
  ${containerFormFragment}
  ${warehouseCardFragment}
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
  voyages,
  containerGroups,
  tags,
  batches,
  importer,
  forwarders,
  inCharges,
  files,
  containers,
}: Object): ShipmentCreate => ({
  no,
  blNo,
  bookingNo,
  invoiceNo,
  memo,
  loadType,
  transportType,
  incoterm,
  carrier,
  blDate: blDate ? new Date(blDate) : null,
  bookingDate: bookingDate ? new Date(bookingDate) : null,
  importerId: importer && importer.id,
  ...(customFields ? { customFields: prepareCustomFieldsData(customFields) } : {}),
  ...(cargoReady ? { cargoReady: formatTimeline(cargoReady) } : {}),
  ...(Array.isArray(tags) ? { tagIds: tags.map(({ id }) => id) } : {}),
  ...(Array.isArray(forwarders) ? { forwarderIds: forwarders.map(({ id }) => id) } : {}),
  ...(Array.isArray(inCharges) ? { inChargeIds: inCharges.map(({ id }) => id) } : {}),
  ...(Array.isArray(batches)
    ? {
        batches: getBatchesInPool(batches).map(batch =>
          prepareUpdateBatchInput(cleanUpData(batch), true, false)
        ),
      }
    : {}),
  ...(Array.isArray(containers) ? { containers: containers.map(prepareNewContainer) } : {}),
  ...(Array.isArray(voyages) ? { voyages: formatVoyages(voyages) } : {}),
  ...(Array.isArray(containerGroups)
    ? { containerGroups: formatContainerGroups(containerGroups) }
    : {}),
  ...(Array.isArray(files)
    ? {
        files: files.map(({ id, name, type, memo: fileMemo }) => ({
          id,
          name,
          type,
          memo: fileMemo,
        })),
      }
    : {}),
});

export const updateShipmentMutation: Object = gql`
  mutation shipmentUpdate($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentUpdate(id: $id, input: $input) {
      ...shipmentFormFragment
      ...badRequestFragment
    }
  }

  ${shipmentFormFragment}
  ${containerFormFragment}
  ${warehouseCardFragment}
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
type DateRevisionType = {
  id: string,
  date: string | Date,
  type: string,
  memo: ?string,
};

type TimelineDateType = {
  date: ?(string | Date),
  assignedTo: Array<{ id: string }>,
  approvedBy: ?{ id: string },
  approvedAt: ?(string | Date),
  memo: ?string,
  timelineDateRevisions: Array<DateRevisionType>,
};

const parseTimelineDateField = (
  key: string,
  originalTimelineDate: ?TimelineDateType,
  newTimelineDate: ?TimelineDateType
) => {
  if (isEquals(originalTimelineDate, newTimelineDate)) return {};

  const parsedNewTimelineDate = {
    ...parseDateField(
      'date',
      getByPathWithDefault(null, 'date', originalTimelineDate),
      getByPathWithDefault(null, 'date', newTimelineDate)
    ),
    ...parseArrayOfIdsField(
      'assignedToIds',
      getByPathWithDefault([], 'assignedTo', originalTimelineDate),
      getByPathWithDefault([], 'assignedTo', newTimelineDate)
    ),
    ...parseApprovalField(
      'approvedById',
      {
        approvedBy: getByPathWithDefault(null, 'approvedBy', originalTimelineDate),
        approvedAt: getByPathWithDefault(null, 'approvedAt', originalTimelineDate),
      },
      {
        approvedBy: getByPathWithDefault(null, 'approvedBy', newTimelineDate),
        approvedAt: getByPathWithDefault(null, 'approvedAt', newTimelineDate),
      }
    ),
    ...parseGenericField(
      'memo',
      getByPathWithDefault(null, 'memo', originalTimelineDate),
      getByPathWithDefault(null, 'memo', newTimelineDate)
    ),
    ...parseArrayOfChildrenField(
      'timelineDateRevisions',
      getByPathWithDefault([], 'timelineDateRevisions', originalTimelineDate),
      getByPathWithDefault([], 'timelineDateRevisions', newTimelineDate),
      (oldDateRevision: ?DateRevisionType, newDateRevision: ?DateRevisionType) => ({
        ...(!oldDateRevision ? {} : { id: oldDateRevision.id }),
        ...parseDateField(
          'date',
          getByPathWithDefault(null, 'date', oldDateRevision),
          getByPathWithDefault(null, 'date', newDateRevision)
        ),
        ...parseEnumField(
          'type',
          getByPathWithDefault(null, 'type', oldDateRevision),
          getByPathWithDefault(null, 'type', newDateRevision)
        ),
        ...parseGenericField(
          'memo',
          getByPathWithDefault(null, 'memo', oldDateRevision),
          getByPathWithDefault(null, 'memo', newDateRevision)
        ),
      })
    ),
  };

  return { [key]: parsedNewTimelineDate };
};

type PortType = {
  seaport: ?string,
  airport: ?string,
};

const parsePortField = (key: string, originalPort: ?PortType, newPort: PortType) => {
  if (isEquals(originalPort, newPort)) return {};

  const parsedNewPort = {
    ...parseEnumField(
      'seaport',
      getByPathWithDefault(null, 'seaport', originalPort),
      newPort.seaport
    ),
    ...parseEnumField(
      'airport',
      getByPathWithDefault(null, 'airport', originalPort),
      newPort.airport
    ),
  };

  return { [key]: parsedNewPort };
};

const cleanWarehouse = (warehouse: ?Object, numberOfContainers: number) => {
  if (numberOfContainers > 0) return null;
  return warehouse;
};

type UpdateShipmentInputType = {
  originalValues: Object,
  existingBatches: Array<Object>,
  newValues: Object,
};

export const prepareParsedUpdateShipmentInput = ({
  originalValues,
  existingBatches,
  newValues,
}: UpdateShipmentInputType): Object => {
  const originalBatchesInPool = getBatchesInPool(originalValues.batches);
  const existingBatchesInPool = getBatchesInPool(existingBatches);
  const newBatchesInPool = getBatchesInPool(newValues.batches);

  const originalBatchIdsInPool = originalBatchesInPool.map(batch => batch.id);
  const existingBatchIdsInPool = existingBatchesInPool.map(batch => batch.id);
  const forceSendBatchIdsForPool = !isEquals(originalBatchIdsInPool, existingBatchIdsInPool);

  return {
    ...parseGenericField('no', originalValues.no, newValues.no),
    ...parseGenericField('blNo', originalValues.blNo, newValues.blNo),
    ...parseDateField('blDate', originalValues.blDate, newValues.blDate),
    ...parseGenericField('bookingNo', originalValues.bookingNo, newValues.bookingNo),
    ...parseDateField('bookingDate', originalValues.bookingDate, newValues.bookingDate),
    ...parseGenericField('invoiceNo', originalValues.invoiceNo, newValues.invoiceNo),
    ...parseEnumField('transportType', originalValues.transportType, newValues.transportType),
    ...parseEnumField('loadType', originalValues.loadType, newValues.loadType),
    ...parseEnumField('incoterm', originalValues.incoterm, newValues.incoterm),
    ...parseGenericField('carrier', originalValues.carrier, newValues.carrier),
    ...parseCustomFieldsField(
      'customFields',
      getByPathWithDefault(null, 'customFields', originalValues),
      newValues.customFields
    ),
    ...parseArrayOfIdsField('tagIds', originalValues.tags, newValues.tags),
    ...parseGenericField('memo', originalValues.memo, newValues.memo),
    ...parseArrayOfIdsField('inChargeIds', originalValues.inCharges, newValues.inCharges),
    ...parseArrayOfIdsField('forwarderIds', originalValues.forwarders, newValues.forwarders),
    ...parseTimelineDateField('cargoReady', originalValues.cargoReady, newValues.cargoReady),
    ...parseArrayOfChildrenField(
      'containerGroups',
      originalValues.containerGroups,
      newValues.containerGroups,
      (oldContainerGroup: ?Object, newContainerGroup: Object) => ({
        ...(!oldContainerGroup ? {} : { id: oldContainerGroup.id }),
        ...parseParentIdField(
          'warehouseId',
          getByPathWithDefault(null, 'warehouse', oldContainerGroup),
          cleanWarehouse(newContainerGroup.warehouse, newValues.containers.length)
        ),
        ...parseTimelineDateField(
          'customClearance',
          getByPathWithDefault(null, 'customClearance', oldContainerGroup),
          newContainerGroup.customClearance
        ),
        ...parseTimelineDateField(
          'warehouseArrival',
          getByPathWithDefault(null, 'warehouseArrival', oldContainerGroup),
          newContainerGroup.warehouseArrival
        ),
        ...parseTimelineDateField(
          'deliveryReady',
          getByPathWithDefault(null, 'deliveryReady', oldContainerGroup),
          newContainerGroup.deliveryReady
        ),
      })
    ),
    ...parseArrayOfChildrenField(
      'voyages',
      originalValues.voyages,
      newValues.voyages,
      (oldVoyage: ?Object, newVoyage: Object) => ({
        ...(!oldVoyage ? {} : { id: oldVoyage.id }),
        ...parseGenericField(
          'vesselName',
          getByPathWithDefault(null, 'vesselName', oldVoyage),
          newVoyage.vesselName
        ),
        ...parseGenericField(
          'vesselCode',
          getByPathWithDefault(null, 'vesselCode', oldVoyage),
          newVoyage.vesselCode
        ),
        ...parsePortField(
          'departurePort',
          getByPathWithDefault(null, 'departurePort', oldVoyage),
          newVoyage.departurePort
        ),
        ...parsePortField(
          'arrivalPort',
          getByPathWithDefault(null, 'arrivalPort', oldVoyage),
          newVoyage.arrivalPort
        ),
        ...parseTimelineDateField(
          'departure',
          getByPathWithDefault(null, 'departure', oldVoyage),
          newVoyage.departure
        ),
        ...parseTimelineDateField(
          'arrival',
          getByPathWithDefault(null, 'arrival', oldVoyage),
          newVoyage.arrival
        ),
      })
    ),
    ...parseArrayOfChildrenField(
      'batches',
      existingBatchesInPool,
      newBatchesInPool,
      (oldBatch: ?Object, newBatch: Object) => ({
        ...prepareParsedUpdateBatchInput(oldBatch, newBatch, {
          inShipmentForm: true,
          inOrderForm: false,
          inContainerForm: false,
          inBatchForm: false,
        }),
      }),
      forceSendBatchIdsForPool
    ),
    ...parseArrayOfChildrenField(
      'containers',
      originalValues.containers,
      newValues.containers,
      (oldContainer: ?Object, newContainer: Object) => {
        const existingBatchesInContainer = existingBatches.filter(
          batch => batch.container && batch.container.id === newContainer.id
        );

        return {
          ...prepareParsedUpdateContainerInput({
            originalValues: oldContainer,
            existingBatches: existingBatchesInContainer,
            newValues: newContainer,
            location: {
              inShipmentForm: true,
              inContainerForm: false,
            },
          }),
        };
      }
    ),
    ...parseFilesField('files', originalValues.files, newValues.files),
  };
};
