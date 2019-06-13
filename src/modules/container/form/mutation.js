// @flow
import gql from 'graphql-tag';
import {
  containerFormFragment,
  userAvatarFragment,
  warehouseCardFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  metricFragment,
  tagFragment,
  batchFormFragment,
  sizeFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
  ownedByFragment,
  taskWithoutParentInfoFragment,
  todoFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
  forbiddenFragment,
} from 'graphql';
import { prepareParsedBatchInput } from 'modules/batch/form/mutation';
import {
  parseGenericField,
  parseEnumField,
  parseMemoField,
  parseDateField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseArrayOfChildrenField,
  parseApprovalField,
  parseRepresentativeBatchIndexField,
} from 'utils/data';
import { isEquals, getByPathWithDefault } from 'utils/fp';

export const updateContainerMutation = gql`
  mutation containerUpdate($id: ID!, $input: ContainerUpdateInput!) {
    containerUpdate(id: $id, input: $input) {
      ...containerFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${containerFormFragment}
  ${userAvatarFragment}
  ${warehouseCardFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${metricFragment}
  ${tagFragment}
  ${batchFormFragment}
  ${sizeFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${badRequestFragment}
  ${ownedByFragment}
  ${taskWithoutParentInfoFragment}
  ${todoFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${forbiddenFragment}
`;

type UpdateContainerInputType = {
  originalValues: Object,
  existingBatches: Array<Object>,
  newValues: Object,
  location: {
    inShipmentForm: boolean,
    inContainerForm: boolean,
  },
};

export const prepareParsedContainerInput = ({
  originalValues,
  existingBatches,
  newValues,
  location,
}: UpdateContainerInputType): Object => {
  const { inShipmentForm, inContainerForm } = location;

  const originalBatchIds = getByPathWithDefault([], 'batches', originalValues).map(
    batch => batch.id
  );
  const existingBatchIds = existingBatches.map(batch => batch.id);
  const forceSendBatchIds = !isEquals(originalBatchIds, existingBatchIds);

  return {
    ...(!inContainerForm && originalValues ? { id: originalValues.id } : {}),
    ...parseGenericField('no', getByPathWithDefault(null, 'no', originalValues), newValues.no),
    ...parseGenericField(
      'containerType',
      getByPathWithDefault(null, 'containerType', originalValues),
      newValues.containerType
    ),
    ...parseEnumField(
      'containerOption',
      getByPathWithDefault(null, 'containerOption', originalValues),
      newValues.containerOption
    ),
    ...parseDateField(
      'warehouseArrivalAgreedDate',
      getByPathWithDefault(null, 'warehouseArrivalAgreedDate', originalValues),
      newValues.warehouseArrivalAgreedDate
    ),
    ...parseArrayOfIdsField(
      'warehouseArrivalAgreedDateAssignedToIds',
      getByPathWithDefault([], 'warehouseArrivalAgreedDateAssignedTo', originalValues),
      newValues.warehouseArrivalAgreedDateAssignedTo
    ),
    ...parseApprovalField(
      'warehouseArrivalAgreedDateApprovedById',
      {
        approvedBy: getByPathWithDefault(
          null,
          'warehouseArrivalAgreedDateApprovedBy',
          originalValues
        ),
        approvedAt: getByPathWithDefault(
          null,
          'warehouseArrivalAgreedDateApprovedAt',
          originalValues
        ),
      },
      {
        approvedBy: newValues.warehouseArrivalAgreedDateApprovedBy,
        approvedAt: newValues.warehouseArrivalAgreedDateApprovedAt,
      }
    ),
    ...parseDateField(
      'warehouseArrivalActualDate',
      getByPathWithDefault(null, 'warehouseArrivalActualDate', originalValues),
      newValues.warehouseArrivalActualDate
    ),
    ...parseArrayOfIdsField(
      'warehouseArrivalActualDateAssignedToIds',
      getByPathWithDefault([], 'warehouseArrivalActualDateAssignedTo', originalValues),
      newValues.warehouseArrivalActualDateAssignedTo
    ),
    ...parseApprovalField(
      'warehouseArrivalActualDateApprovedById',
      {
        approvedBy: getByPathWithDefault(
          null,
          'warehouseArrivalActualDateApprovedBy',
          originalValues
        ),
        approvedAt: getByPathWithDefault(
          null,
          'warehouseArrivalActualDateApprovedAt',
          originalValues
        ),
      },
      {
        approvedBy: newValues.warehouseArrivalActualDateApprovedBy,
        approvedAt: newValues.warehouseArrivalActualDateApprovedAt,
      }
    ),
    ...parseDateField(
      'freeTimeStartDate',
      getByPathWithDefault(null, 'freeTimeStartDate', originalValues),
      newValues.freeTimeStartDate
    ),
    ...parseGenericField(
      'freeTimeDuration',
      getByPathWithDefault(null, 'freeTimeDuration', originalValues),
      newValues.freeTimeDuration
    ),
    ...parseGenericField(
      'autoCalculatedFreeTimeStartDate',
      getByPathWithDefault(null, 'autoCalculatedFreeTimeStartDate', originalValues),
      newValues.autoCalculatedFreeTimeStartDate
    ),
    ...parseGenericField(
      'yardName',
      getByPathWithDefault(null, 'yardName', originalValues),
      newValues.yardName
    ),
    ...parseDateField(
      'departureDate',
      getByPathWithDefault(null, 'departureDate', originalValues),
      newValues.departureDate
    ),
    ...parseArrayOfIdsField(
      'departureDateAssignedToIds',
      getByPathWithDefault([], 'departureDateAssignedTo', originalValues),
      newValues.departureDateAssignedTo
    ),
    ...parseApprovalField(
      'departureDateApprovedById',
      {
        approvedBy: getByPathWithDefault(null, 'departureDateApprovedBy', originalValues),
        approvedAt: getByPathWithDefault(null, 'departureDateApprovedAt', originalValues),
      },
      {
        approvedBy: newValues.departureDateApprovedBy,
        approvedAt: newValues.departureDateApprovedAt,
      }
    ),
    ...parseArrayOfIdsField(
      'tagIds',
      getByPathWithDefault([], 'tags', originalValues),
      newValues.tags
    ),
    ...parseMemoField('memo', getByPathWithDefault(null, 'memo', originalValues), newValues.memo),
    ...parseParentIdField(
      'warehouseId',
      getByPathWithDefault(null, 'warehouse', originalValues),
      newValues.warehouse
    ),
    ...parseArrayOfChildrenField(
      'batches',
      existingBatches,
      newValues.batches,
      (oldBatch: ?Object, newBatch: Object) => ({
        ...prepareParsedBatchInput(oldBatch, newBatch, {
          inShipmentForm,
          inContainerForm,
        }),
      }),
      forceSendBatchIds
    ),
    ...parseRepresentativeBatchIndexField(
      'representativeBatchIndex',
      getByPathWithDefault(null, 'representativeBatch', originalValues),
      newValues.representativeBatch,
      newValues.batches
    ),
  };
};

export default updateContainerMutation;
