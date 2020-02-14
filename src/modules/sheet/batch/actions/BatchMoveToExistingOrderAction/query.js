import gql from 'graphql-tag';
import {
  orderCardWithOwnedFragment,
  orderCardFragment,
  ownedByFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  taskCountFragment,
  forbiddenFragment,
} from 'graphql';

export const orderListQuery = gql`
  query orderListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
  ) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Order {
          ...orderCardWithOwnedFragment
          orderItems {
            ... on OrderItem {
              id
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
  ${taskCountFragment}
  ${forbiddenFragment}
`;

export default orderListQuery;
