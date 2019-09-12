import gql from 'graphql-tag';
import {
  orderCardWithOwnedFragment,
  orderCardFragment,
  ownedByFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  userAvatarFragment,
  taskCountFragment,
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
          timeline {
            ... on Timeline {
              unreadCount
            }
          }
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
  ${taskCountFragment}
  ${forbiddenFragment}
`;

export default orderListQuery;
