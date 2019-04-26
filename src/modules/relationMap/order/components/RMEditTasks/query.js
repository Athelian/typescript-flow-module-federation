// @flow
import gql from 'graphql-tag';
import {
  taskFormFragment,
  userAvatarFragment,
  tagFragment,
  orderCardFragment,
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
  query($page: Int!, $perPage: Int!, $filterBy: TaskFilterInput, $sortBy: TaskSortInput) {
    tasks(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...taskFormFragment
      }
      page
      totalPage
    }
  }

  ${taskFormFragment}
  ${orderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${productCardFragment}
  ${productProviderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${todoFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${sizeFragment}
`;

export default editableTaskListQuery;
