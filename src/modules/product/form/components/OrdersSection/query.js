import gql from 'graphql-tag';
import {
  orderCardFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  userAvatarFragment,
  todoFragment,
} from 'graphql';

export const ordersInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Order {
          ...orderCardFragment
        }
      }
      totalCount
      page
      totalPage
    }
  }

  ${orderCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${userAvatarFragment}
  ${todoFragment}
`;

export default ordersInProductQuery;
