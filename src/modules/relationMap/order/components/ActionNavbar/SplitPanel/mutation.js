// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
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

export const batchSimpleSplitMutation = gql`
  mutation batchSimpleSplit($id: ID!, $input: BatchSimpleSplitInput!) {
    batchSimpleSplit(id: $id, input: $input) {
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
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${taskTemplateCardFragment}
`;

export const batchEqualSplitMutation = gql`
  mutation batchEqualSplit($id: ID!, $input: BatchEqualSplitInput!) {
    batchEqualSplit(id: $id, input: $input) {
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
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${taskTemplateCardFragment}
`;
