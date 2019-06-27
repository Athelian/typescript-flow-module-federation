// @flow
import gql from 'graphql-tag';
import {
  itemInSelectorFragment,
  priceFragment,
  tagFragment,
  taskCountFragment,
  metricFragment,
  sizeFragment,
  imageFragment,
  orderCardFragment,
  partnerNameFragment,
  partnerCardFragment,
  userAvatarFragment,
  ownedByFragment,
} from 'graphql';

export const orderItemsListQuery = gql`
  query orderItemsListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderItemFilterInput
    $sortBy: OrderItemSortInput
  ) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      page
      totalPage
      nodes {
        ...itemInSelectorFragment
      }
    }
  }

  ${itemInSelectorFragment}
  ${priceFragment}
  ${tagFragment}
  ${taskCountFragment}
  ${metricFragment}
  ${sizeFragment}
  ${imageFragment}
  ${orderCardFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
`;

export default orderItemsListQuery;
