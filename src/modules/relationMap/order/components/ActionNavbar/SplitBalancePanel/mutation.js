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

export const batchBalanceSplitManyMutation = gql`
  mutation batchBalanceSplitMany($orderItemIds: [ID!]!) {
    batchBalanceSplitMany(orderItemIds: $orderItemIds) {
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

export default batchBalanceSplitManyMutation;
