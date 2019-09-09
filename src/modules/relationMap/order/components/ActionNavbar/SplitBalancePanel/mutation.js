// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  forbiddenFragment,
  metricFragment,
  tagFragment,
  milestoneCardFragment,
  projectCardFragment,
  milestoneFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  taskCountFragment,
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
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
  ${batchCardRMFragment}
  ${tagFragment}
  ${metricFragment}
  ${userAvatarFragment}
  ${taskFormInTemplateFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskCountFragment}
`;

export default batchBalanceSplitManyMutation;
