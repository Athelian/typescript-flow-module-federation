import gql from 'graphql-tag';
import {
  tagFragment,
  priceFragment,
  imageFragment,
  todoFragment,
  itemCardWithOwnedFragment,
  partnerNameFragment,
  ownedByFragment,
} from 'graphql';

export const orderItemListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...itemCardWithOwnedFragment
      }
      page
      totalPage
    }
  }

  ${itemCardWithOwnedFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${todoFragment}
  ${ownedByFragment}
`;

export default orderItemListQuery;
