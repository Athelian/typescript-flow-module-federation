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
  todoFragment,
} from 'graphql';
import { prepareParsedUpdateBatchInput } from 'modules/batch/form/mutation';
import {
  parseGenericField,
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
  ${partnerCardFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${badRequestFragment}
  ${ownedByFragment}
  ${todoFragment}
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

export const prepareParsedUpdateContainerInput = ({
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
        ...prepareParsedUpdateBatchInput(oldBatch, newBatch, {
          inShipmentForm,
          inOrderForm: false,
          inContainerForm,
          inBatchForm: false,
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
