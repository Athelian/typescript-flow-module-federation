// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { prepareUpdateBatchInput } from 'modules/batch/form/mutation';
import { cleanUpData } from 'utils/data';
import { isNullOrUndefined } from 'utils/fp';

export const updateContainerMutation = gql`
  mutation containerUpdate($id: ID!, $input: ContainerUpdateInput!) {
    containerUpdate(id: $id, input: $input) {
      container {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

const prepareUserIdForGraphQL = (user: Object, field: string) => {
  if (isNullOrUndefined(user)) return {};
  const data = {};
  data[field] = user.id;

  return data;
};

export const prepareUpdateContainerInput = ({
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
  warehouseArrivalAgreedDateApprovedBy,
  warehouseArrivalActualDateApprovedBy,
  batches,
  ...rest
}: Object) => ({
  ...rest,
  tagIds: tags.map(({ id }) => id),
  warehouseId: warehouse.id,
  ...prepareUserIdForGraphQL(
    warehouseArrivalAgreedDateApprovedBy,
    'warehouseArrivalAgreedDateApprovedById'
  ),
  ...prepareUserIdForGraphQL(
    warehouseArrivalActualDateApprovedBy,
    'warehouseArrivalActualDateApprovedById'
  ),

  batches: batches
    .map(batch => prepareUpdateBatchInput(cleanUpData(batch), true, false))
    .map(({ container, ...batch }) => ({ ...batch })),
});

export default updateContainerMutation;
