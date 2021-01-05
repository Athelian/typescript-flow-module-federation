// @flow
import gql from 'graphql-tag';
import {
  orderCardFragment,
  ownedByFragment,
  partnerNameFragment,
  tagFragment,
  priceFragment,
  taskCountFragment,
  forbiddenFragment,
} from 'graphql';

export const ordersQuery = gql`
  query orders($filterBy: OrderFilterInput, $sortBy: OrderSortInput, $page: Int!, $perPage: Int!) {
    orders(filterBy: $filterBy, sortBy: $sortBy, page: $page, perPage: $perPage) {
      nodes {
        ...orderCardFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${orderCardFragment}
  ${ownedByFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${priceFragment}
  ${taskCountFragment}
  ${forbiddenFragment}
`;

export const ordersByIDsQuery = gql`
  query ordersByIDs($ids: [ID!]!) {
    ordersByIDs(ids: $ids) {
      ... on Order {
        id
        poNo
      }
    }
  }
`;