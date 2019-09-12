// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  forbiddenFragment,
  taskWithParentInfoFragment,
  milestoneCardFragment,
  projectCardFragment,
  milestoneFragment,
  userAvatarFragment,
  tagFragment,
  orderCardFragment,
  itemCardFragment,
  batchCardFragment,
  productCardFragment,
  shipmentCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
  taskCountFragment,
  productProviderCardFragment,
  sizeFragment,
  ownedByFragment,
  productProviderPackagingFragment,
} from 'graphql';
import { parseTaskField, parseParentIdField } from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

export const updateTaskMutation = gql`
  mutation taskUpdate($id: ID!, $input: TaskUpdateInput!) {
    taskUpdate(id: $id, input: $input) {
      ...taskWithParentInfoFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
  ${taskWithParentInfoFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${milestoneFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${orderCardFragment}
  ${batchCardFragment}
  ${productCardFragment}
  ${shipmentCardFragment}
  ${itemCardFragment}
  ${productProviderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${taskCountFragment}
  ${sizeFragment}
  ${ownedByFragment}
  ${productProviderPackagingFragment}
`;

export const prepareParsedTaskInput = (originalValues: ?Object, values: Object) => ({
  ...parseTaskField(originalValues, values),
  ...parseParentIdField(
    'milestoneId',
    getByPathWithDefault(null, 'milestone', originalValues),
    values.milestone
  ),
});
