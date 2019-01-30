// @flow
import gql from 'graphql-tag';
import { metricFragment, tagFragment, badRequestFragment } from 'graphql';
import { batchCardRMFragment } from 'modules/relationMapBeta/order/query';

export const cloneBatchMutation = gql`
  mutation batchClone($id: ID!, $input: BatchUpdateInput!) {
    batchClone(id: $id, input: $input) {
      ...batchCardRMFragment
      ...badRequestFragment
    }
  }

  ${batchCardRMFragment}
  ${tagFragment}
  ${metricFragment}
  ${badRequestFragment}
`;

export default cloneBatchMutation;
