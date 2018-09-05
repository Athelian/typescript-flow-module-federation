// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { unflatten } from 'utils/data';
import type { BatchNew, BatchDetail } from '../type.js.flow';

export const createBatchMutation = gql`
  mutation batchCreate($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      batch {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const prepareCreateBatchInput = ({ tags, orderItem, ...data }: BatchNew) => ({
  ...data,
  orderItemId: orderItem.id,
  tagIds: tags ? tags.map(t => t.id) : null,
});

export const updateBatchMutation = gql`
  mutation batchUpdate($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      batch {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

/* eslint-disable */
export const prepareUpdateBatchInput = ({
  id,
  createdAt,
  updatedAt,
  updatedBy,
  orderItem,
  tags,
  packageGrossWeight_value,
  packageVolume_value,
  packageSize_length_value,
  packageSize_width_value,
  packageSize_height_value,
  ...rest
}: Object): BatchDetail => {
  const dataCopy = {};
  if (packageGrossWeight_value) dataCopy.packageGrossWeight_metric = 'kg';
  if (packageVolume_value) dataCopy.packageVolume_metric = 'cm³';
  if (packageSize_length_value) dataCopy.packageSize_length_metric = 'cm';
  if (packageSize_width_value) dataCopy.packageSize_width_metric = 'cm';
  if (packageSize_height_value) dataCopy.packageSize_height_metric = 'cm';

  return {
    ...unflatten({ ...rest, dataCopy }),
    orderItemId: orderItem.id,
    tagIds: tags ? tags.map(t => t.id) : null,
  };
};
