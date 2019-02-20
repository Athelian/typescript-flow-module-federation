// @flow
import gql from 'graphql-tag';
import { badRequestFragment, metricFragment, tagFragment } from 'graphql';
import { batchCardRMFragment } from 'modules/relationMapBeta/order/query';

export const updateBatchMutation = gql`
  mutation batchUpdate($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      ...batchCardRMFragment
      ...badRequestFragment
    }
  }

  ${batchCardRMFragment}
  ${tagFragment}
  ${metricFragment}
  ${badRequestFragment}
`;

export default updateBatchMutation;
