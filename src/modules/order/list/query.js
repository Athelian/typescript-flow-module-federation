import gql from 'graphql-tag';
import {
  orderCardWithOwnedFragment,
  orderCardFragment,
  ownedByFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  userAvatarFragment,
  todoFragment,
  forbiddenFragment,
} from 'graphql';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Order {
          ...orderCardWithOwnedFragment
          batchCount
          batchShippedCount
        }
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }
  ${orderCardWithOwnedFragment}
  ${orderCardFragment}
  ${ownedByFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${userAvatarFragment}
  ${todoFragment}
  ${forbiddenFragment}
`;

export default orderListQuery;
