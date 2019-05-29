import gql from 'graphql-tag';
import {
  tagFragment,
  priceFragment,
  imageFragment,
  todoFragment,
  itemCardFragment,
  partnerNameFragment,
} from 'graphql';

export const orderItemListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...itemCardFragment
      }
      page
      totalPage
    }
  }

  ${itemCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${todoFragment}
`;

export default orderItemListQuery;
