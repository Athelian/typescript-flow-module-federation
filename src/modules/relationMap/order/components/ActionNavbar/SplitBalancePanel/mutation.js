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

export const batchBalanceSplitMutation = gql`
  mutation batchBalanceSplit($orderItemId: ID!) {
    batchBalanceSplit(orderItemId: $orderItemId) {
      ... on Batches {
        batches {
          ...batchCardRMFragment
        }
      }
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

export default batchBalanceSplitMutation;
