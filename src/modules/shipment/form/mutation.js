// @flow
import gql from 'graphql-tag';
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
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardNewFragment,
  milestoneFragment,
  taskCountFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
  forbiddenFragment,
  productProviderPackagingFragment,
  documentFragment,
} from 'graphql';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import { prepareParsedBatchInput } from 'modules/batch/form/mutation';
import { prepareParsedContainerInput } from 'modules/container/form/mutation';
import { getBatchesInPool } from 'modules/shipment/helpers';
import {
  parseGenericField,
  parseMemoField,
  parseDateField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseArrayOfChildrenField,
  parseApprovalField,
  parseFilesField,
  parseEnumField,
  parseCustomFieldsField,
  parseTodoField,
} from 'utils/data';

export const createShipmentMutation: Object = gql`
  mutation shipmentCreate($input: ShipmentCreateInput!) {
    shipmentCreate(input: $input) {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
            orderItem {
              ... on OrderItem {
                id
                order {
                  ... on Order {
                    id
                  }
                }
              }
            }
          }
        }
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const updateShipmentMutation: Object = gql`
  mutation shipmentUpdate($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentUpdate(id: $id, input: $input) {
      ...shipmentFormFragment
      ...badRequestFragment
      ...forbiddenFragment
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
  ${badRequestFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${milestoneCardFragment}
  ${projectCardNewFragment}
  ${milestoneFragment}
  ${taskCountFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
  ${documentFragment}
`;

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
        ...parseMemoField(
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

const parsePortField = (key: string, originalPort: ?PortType, newPort: ?PortType) => {
  if (isEquals(originalPort, newPort)) return {};

  const parsedNewPort = {
    ...parseEnumField(
      'seaport',
      getByPathWithDefault(null, 'seaport', originalPort),
      getByPathWithDefault(null, 'seaport', newPort)
    ),
    ...parseEnumField(
      'airport',
      getByPathWithDefault(null, 'airport', originalPort),
      getByPathWithDefault(null, 'airport', newPort)
    ),
  };

  return { [key]: parsedNewPort };
};

type ShipmentInputType = {
  originalValues: ?Object,
  existingBatches: Array<Object>,
  newValues: Object,
};

export const prepareParsedShipmentInput = ({
  originalValues,
  existingBatches,
  newValues,
}: ShipmentInputType): Object => {
  const originalBatches = getByPathWithDefault([], 'batches', originalValues);
  const newBatches = newValues.batches;

  const existingBatchesInPool = getBatchesInPool(existingBatches);
  const newBatchesInPool = getBatchesInPool(newBatches);

  const originalBatchIds = originalBatches.map(batch => batch.id);
  const newBatchIds = newBatches.map(batch => batch.id);
  const forceSendBatchIdsForPool = !isEquals(originalBatchIds, newBatchIds);

  return {
    ...parseParentIdField(
      'importerId',
      getByPathWithDefault(null, 'importer', originalValues),
      newValues.importer
    ),
    ...parseParentIdField(
      'exporterId',
      getByPathWithDefault(null, 'exporter', originalValues),
      newValues.exporter
    ),
    ...parseGenericField('no', getByPathWithDefault(null, 'no', originalValues), newValues.no),
    ...parseGenericField(
      'blNo',
      getByPathWithDefault(null, 'blNo', originalValues),
      newValues.blNo
    ),
    ...parseDateField(
      'blDate',
      getByPathWithDefault(null, 'blDate', originalValues),
      newValues.blDate
    ),
    ...parseGenericField(
      'booked',
      getByPathWithDefault(null, 'booked', originalValues),
      newValues.booked
    ),
    ...parseGenericField(
      'bookingNo',
      getByPathWithDefault(null, 'bookingNo', originalValues),
      newValues.bookingNo
    ),
    ...parseDateField(
      'bookingDate',
      getByPathWithDefault(null, 'bookingDate', originalValues),
      newValues.bookingDate
    ),
    ...parseGenericField(
      'invoiceNo',
      getByPathWithDefault(null, 'invoiceNo', originalValues),
      newValues.invoiceNo
    ),
    ...parseGenericField(
      'contractNo',
      getByPathWithDefault(null, 'contractNo', originalValues),
      newValues.contractNo
    ),
    ...parseEnumField(
      'transportType',
      getByPathWithDefault(null, 'transportType', originalValues),
      newValues.transportType
    ),
    ...parseEnumField(
      'loadType',
      getByPathWithDefault(null, 'loadType', originalValues),
      newValues.loadType
    ),
    ...parseEnumField(
      'incoterm',
      getByPathWithDefault(null, 'incoterm', originalValues),
      newValues.incoterm
    ),
    ...parseGenericField(
      'carrier',
      getByPathWithDefault(null, 'carrier', originalValues),
      newValues.carrier
    ),
    ...parseCustomFieldsField(
      'customFields',
      getByPathWithDefault(null, 'customFields', originalValues),
      newValues.customFields
    ),
    ...parseArrayOfIdsField(
      'tagIds',
      getByPathWithDefault([], 'tags', originalValues),
      newValues.tags
    ),
    ...parseMemoField('memo', getByPathWithDefault(null, 'memo', originalValues), newValues.memo),
    ...parseArrayOfIdsField(
      'inChargeIds',
      getByPathWithDefault([], 'inCharges', originalValues),
      newValues.inCharges
    ),
    ...parseArrayOfIdsField(
      'forwarderIds',
      getByPathWithDefault([], 'forwarders', originalValues),
      newValues.forwarders
    ),
    ...parseTimelineDateField(
      'cargoReady',
      getByPathWithDefault({}, 'cargoReady', originalValues),
      newValues.cargoReady
    ),
    ...parseArrayOfChildrenField(
      'containerGroups',
      getByPathWithDefault([{}], 'containerGroups', originalValues),
      newValues.containerGroups,
      (oldContainerGroup: ?Object, newContainerGroup: Object) => ({
        ...(!oldContainerGroup ? {} : { id: oldContainerGroup.id }),
        ...parseParentIdField(
          'warehouseId',
          getByPathWithDefault(null, 'warehouse', oldContainerGroup),
          newContainerGroup.warehouse
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
      getByPathWithDefault([{}], 'voyages', originalValues),
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
        ...prepareParsedBatchInput(oldBatch, newBatch, {
          inShipmentForm: true,
        }),
      }),
      forceSendBatchIdsForPool
    ),
    ...parseArrayOfChildrenField(
      'containers',
      getByPathWithDefault([], 'containers', originalValues),
      newValues.containers,
      (oldContainer: ?Object, newContainer: Object) => {
        const existingBatchesInContainer = existingBatches.filter(
          batch => batch.container && batch.container.id === newContainer.id
        );

        return {
          ...prepareParsedContainerInput({
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
    ...parseFilesField('files', getByPathWithDefault([], 'files', originalValues), newValues.files),
    ...parseTodoField(
      getByPathWithDefault(
        { tasks: [], taskTemplate: null, milestone: null },
        'todo',
        originalValues
      ),
      newValues.todo
    ),
  };
};
