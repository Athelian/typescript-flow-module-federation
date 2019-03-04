// @flow
import { findIndex } from 'lodash';
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
} from 'graphql';
import {
  prepareUpdateBatchInput,
  prepareParsedUpdateBatchInput,
} from 'modules/batch/form/mutation';
import {
  cleanUpData,
  parseGenericField,
  parseDateField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseArrayOfChildrenField,
  parseApprovalField,
  parseRepresentativeBatchIndexField,
} from 'utils/data';
import { isNullOrUndefined } from 'utils/fp';

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
`;

const getIdOrReturnNull = (obj: { id: string }): string | null =>
  isNullOrUndefined(obj) ? null : obj.id;

const getDateOrReturnNull = (date: string): Date | null => (date ? new Date(date) : null);

export const prepareContainer = ({
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
  warehouseId: getIdOrReturnNull(warehouse),
  warehouseArrivalAgreedDate: getDateOrReturnNull(warehouseArrivalAgreedDate),
  warehouseArrivalActualDate: getDateOrReturnNull(warehouseArrivalActualDate),
  warehouseArrivalAgreedDateApprovedById: getIdOrReturnNull(warehouseArrivalAgreedDateApprovedBy),
  warehouseArrivalActualDateApprovedById: getIdOrReturnNull(warehouseArrivalActualDateApprovedBy),
  warehouseArrivalAgreedDateAssignedToIds: isNullOrUndefined(warehouseArrivalAgreedDateAssignedTo)
    ? null
    : warehouseArrivalAgreedDateAssignedTo.map(getIdOrReturnNull),
  warehouseArrivalActualDateAssignedToIds: isNullOrUndefined(warehouseArrivalActualDateAssignedTo)
    ? null
    : warehouseArrivalActualDateAssignedTo.map(getIdOrReturnNull),
  batches: isNullOrUndefined(batches)
    ? null
    : batches.map(batch => prepareUpdateBatchInput(cleanUpData(batch), true, false)),
  tagIds: isNullOrUndefined(tags) ? null : tags.map(getIdOrReturnNull),
  representativeBatchIndex: representativeBatch
    ? findIndex(batches, batch => batch.id === representativeBatch.id)
    : null,
});

export const prepareParsedUpdateContainerInput = (
  originalValues: Object,
  newValues: Object,
  location: {
    inShipmentForm: boolean,
    inContainerForm: boolean,
  }
): Object => {
  const { inShipmentForm, inContainerForm } = location;

  return {
    ...(inContainerForm ? {} : parseParentIdField('id', originalValues, newValues)),
    ...parseGenericField('no', originalValues.no, newValues.no),
    ...parseDateField(
      'warehouseArrivalAgreedDate',
      originalValues.warehouseArrivalAgreedDate,
      newValues.warehouseArrivalAgreedDate
    ),
    ...parseArrayOfIdsField(
      'warehouseArrivalAgreedDateAssignedToIds',
      originalValues.warehouseArrivalAgreedDateAssignedTo,
      newValues.warehouseArrivalAgreedDateAssignedTo
    ),
    ...parseApprovalField(
      'warehouseArrivalAgreedDateApprovedById',
      {
        approvedBy: originalValues.warehouseArrivalAgreedDateApprovedBy,
        approvedAt: originalValues.warehouseArrivalAgreedDateApprovedAt,
      },
      {
        approvedBy: newValues.warehouseArrivalAgreedDateApprovedBy,
        approvedAt: newValues.warehouseArrivalAgreedDateApprovedAt,
      }
    ),
    ...parseDateField(
      'warehouseArrivalActualDate',
      originalValues.warehouseArrivalActualDate,
      newValues.warehouseArrivalActualDate
    ),
    ...parseArrayOfIdsField(
      'warehouseArrivalActualDateAssignedToIds',
      originalValues.warehouseArrivalActualDateAssignedTo,
      newValues.warehouseArrivalActualDateAssignedTo
    ),
    ...parseApprovalField(
      'warehouseArrivalActualDateApprovedById',
      {
        approvedBy: originalValues.warehouseArrivalActualDateApprovedBy,
        approvedAt: originalValues.warehouseArrivalActualDateApprovedAt,
      },
      {
        approvedBy: newValues.warehouseArrivalActualDateApprovedBy,
        approvedAt: newValues.warehouseArrivalActualDateApprovedAt,
      }
    ),
    ...parseArrayOfIdsField('tagIds', originalValues.tags, newValues.tags),
    ...parseGenericField('memo', originalValues.memo, newValues.memo),
    ...parseParentIdField('warehouseId', originalValues.warehouse, newValues.warehouse),
    ...parseArrayOfChildrenField(
      'batches',
      originalValues.batches,
      newValues.batches,
      (oldBatch: ?Object, newBatch: Object) => {
        return {
          ...prepareParsedUpdateBatchInput(oldBatch, newBatch, {
            inShipmentForm,
            inOrderForm: false,
            inContainerForm,
            inBatchForm: false,
          }),
        };
      }
    ),
    ...parseRepresentativeBatchIndexField(
      'representativeBatchIndex',
      originalValues.representativeBatch,
      newValues.representativeBatch,
      newValues.batches
    ),
  };
};

export default updateContainerMutation;
