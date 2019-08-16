// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';

export const orderFragmentInGlobalView = gql`
  fragment orderFragmentInGlobalView on Order {
    id
    poNo
    currency
    orderItems {
      ...orderItemFragmentInGlobalView
    }
  }
`;

export const orderItemFragmentInGlobalView = gql`
  fragment orderItemFragmentInGlobalView on OrderItem {
    id
    no
    quantity
    batches {
      ...batchFragmentInGlobalView
    }
  }
`;

export const batchFragmentInGlobalView = gql`
  fragment batchFragmentInGlobalView on Batch {
    id
    no
    quantity
    container {
      ... on Container {
        id
        no
      }
    }
    shipment {
      ... on Shipment {
        id
        no
      }
    }
  }
`;

export const ordersInGlobalViewQuery = gql`
  query ordersInGlobalViewQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
  ) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderFragmentInGlobalView
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }
  ${orderFragmentInGlobalView}
  ${orderItemFragmentInGlobalView}
  ${batchFragmentInGlobalView}

  ${forbiddenFragment}
`;

export default ordersInGlobalViewQuery;
