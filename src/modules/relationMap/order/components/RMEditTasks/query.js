// @flow
import gql from 'graphql-tag';
import {
  taskWithParentInfoFragment,
  milestoneCardFragment,
  projectCardNewFragment,
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

const editableTaskListQuery = gql`
  query editableTaskListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: TaskFilterInput
    $sortBy: TaskSortInput
  ) {
    tasks(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...taskWithParentInfoFragment
      }
      page
      totalPage
    }
  }

  ${taskWithParentInfoFragment}
  ${milestoneCardFragment}
  ${projectCardNewFragment}
  ${milestoneFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${orderCardFragment}
  ${itemCardFragment}
  ${batchCardFragment}
  ${productCardFragment}
  ${shipmentCardFragment}
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

export default editableTaskListQuery;
