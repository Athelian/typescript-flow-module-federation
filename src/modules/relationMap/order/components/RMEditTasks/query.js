// @flow
import gql from 'graphql-tag';
import {
  taskFormFragment,
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
        ...taskFormFragment
      }
      page
      totalPage
    }
  }

  ${taskFormFragment}
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
`;

export default editableTaskListQuery;
