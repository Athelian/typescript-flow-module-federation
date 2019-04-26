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
  ${userAvatarFragment}
  ${tagFragment}
  ${orderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${partnerNameFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${orderCardFragment}
  ${itemCardFragment}
  ${batchCardFragment}
  ${productCardFragment}
  ${shipmentCardFragment}
  ${orderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${todoFragment}
  ${productProviderCardFragment}
`;

export default editableTaskListQuery;
