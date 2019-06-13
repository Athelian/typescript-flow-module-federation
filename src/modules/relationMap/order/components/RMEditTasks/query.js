// @flow
import gql from 'graphql-tag';
import {
  taskWithParentInfoFragment,
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
  todoFragment,
  productProviderCardFragment,
  sizeFragment,
  ownedByFragment,
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
  ${todoFragment}
  ${sizeFragment}
  ${ownedByFragment}
`;

export default editableTaskListQuery;
