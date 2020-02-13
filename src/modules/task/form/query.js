// @flow
import gql from 'graphql-tag';

import {
  taskWithParentInfoFragment,
  milestoneCardFragment,
  projectCardFragment,
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
  forbiddenFragment,
} from 'graphql';

export const taskFormQuery = gql`
  query taskFormQuery($id: ID!) {
    task(id: $id) {
      ...taskWithParentInfoFragment
    }
  }

  ${taskWithParentInfoFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
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
  ${forbiddenFragment}
`;

export default taskFormQuery;
