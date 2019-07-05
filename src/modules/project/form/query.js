// @flow
import gql from 'graphql-tag';
import {
  projectFormQueryFragment,
  taskWithParentInfoFragment,
  milestoneCardFragment,
  projectCardFragment,
  userAvatarFragment,
  tagFragment,
  productCardFragment,
  productProviderCardFragment,
  orderCardFragment,
  itemCardFragment,
  batchCardFragment,
  shipmentCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
  taskCountFragment,
  sizeFragment,
  ownedByFragment,
} from 'graphql';

export const projectFormQuery = gql`
  query projectFormQuery($id: ID!) {
    project(id: $id) {
      ...projectFormQueryFragment
    }
  }

  ${projectFormQueryFragment}
  ${taskWithParentInfoFragment}
  ${taskCountFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${taskWithParentInfoFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${orderCardFragment}
  ${productCardFragment}
  ${productProviderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${itemCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${taskCountFragment}
  ${sizeFragment}
`;

export default projectFormQuery;
