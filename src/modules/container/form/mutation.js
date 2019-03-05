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
import { isNullOrUndefined, isEquals, getByPathWithDefault } from 'utils/fp';

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

  const originalAndExistingBatches = [
    ...getByPathWithDefault([], 'batches', originalValues),
    ...existingBatches.filter(
      existingBatch =>
        getByPathWithDefault([], 'batches', originalValues).findIndex(
          batch => batch.id === existingBatch.id
        ) < 0
    ),
  ];

  const originalBatchIds = getByPathWithDefault([], 'batches', originalValues).map(
    batch => batch.id
  );
  const existingBatchIds = existingBatches.map(batch => batch.id);
  const forceSendBatchIds = !isEquals(originalBatchIds, existingBatchIds);

  return {
    ...(!inContainerForm && originalValues
      ? parseParentIdField('id', originalValues, newValues)
      : {}),
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
    ...parseGenericField(
      'memo',
      getByPathWithDefault(null, 'memo', originalValues),
      newValues.memo
    ),
    ...parseParentIdField(
      'warehouseId',
      getByPathWithDefault(null, 'warehouse', originalValues),
      newValues.warehouse
    ),
    ...parseArrayOfChildrenField(
      'batches',
      originalAndExistingBatches,
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
