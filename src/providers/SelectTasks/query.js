// @flow
import gql from 'graphql-tag';
import {
  taskWithParentInfoFragment,
  userAvatarFragment,
  tagFragment,
  milestoneCardFragment,
  projectCardFragment,
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
  notFoundFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';

export const selectTaskListQuery = gql`
  query selectTaskListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: TaskFilterInput
    $sortBy: TaskSortInput
  ) {
    tasks(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...taskWithParentInfoFragment
        ...notFoundFragment
        ...badRequestFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${notFoundFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
  ${taskWithParentInfoFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${ownedByFragment}
  ${taskWithParentInfoFragment}
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

export default selectTaskListQuery;
