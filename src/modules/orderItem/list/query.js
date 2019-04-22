import gql from 'graphql-tag';
import {
  tagFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  todoFragment,
  itemCardFragment,
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
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${todoFragment}
`;

export default orderItemListQuery;
