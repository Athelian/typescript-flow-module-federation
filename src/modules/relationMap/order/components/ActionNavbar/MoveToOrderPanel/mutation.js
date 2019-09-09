// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  priceFragment,
  milestoneCardFragment,
  projectCardNewFragment,
  milestoneFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
  taskCountFragment,
} from 'graphql';
import {
  productProviderRMFragment,
  orderCardRMFragment,
  batchCardRMFragment,
  shipmentCardRMFragment,
} from 'modules/relationMap/order/query';

export const updateOrderMutation = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...orderCardRMFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${orderCardRMFragment}
  ${productProviderRMFragment}
  ${batchCardRMFragment}
  ${shipmentCardRMFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${priceFragment}
  ${taskFormInTemplateFragment}
  ${milestoneCardFragment}
  ${projectCardNewFragment}
  ${milestoneFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskCountFragment}
`;

export default updateOrderMutation;
