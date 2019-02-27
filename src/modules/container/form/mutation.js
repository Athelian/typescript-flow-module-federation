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
import { prepareUpdateBatchInput } from 'modules/batch/form/mutation';
import { cleanUpData } from 'utils/data';
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

export default updateContainerMutation;
