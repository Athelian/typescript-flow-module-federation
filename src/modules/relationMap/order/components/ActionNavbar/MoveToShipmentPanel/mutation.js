// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  metricFragment,
  tagFragment,
  taskFormInSlideViewFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  userAvatarFragment,
} from 'graphql';
import { batchCardRMFragment } from 'modules/relationMap/order/query';

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
  ${userAvatarFragment}
  ${taskFormInTemplateFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
`;

export default updateBatchMutation;
