// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';

const orderFragmentGlobalView = gql`
  fragment orderFragmentGlobalView on Order {
    id
    poNo
    currency
    orderItems {
      ...orderItemFragmentGlobalView
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const orderItemFragmentGlobalView = gql`
  fragment orderItemFragmentGlobalView on OrderItem {
    id
    no
    quantity
    batches {
      ...batchFragmentGlobalView
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const batchFragmentGlobalView = gql`
  fragment batchFragmentGlobalView on Batch {
    id
    no
    quantity
    container {
      ... on Container {
        id
        no
        ownedBy {
          ... on Organization {
            id
          }
        }
      }
    }
    shipment {
      ... on Shipment {
        id
        no
        ownedBy {
          ... on Organization {
            id
          }
        }
      }
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const ordersGlobalViewQuery = gql`
  query ordersInGlobalViewQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
  ) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderFragmentGlobalView
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }
  ${orderFragmentGlobalView}
  ${orderItemFragmentGlobalView}
  ${batchFragmentGlobalView}

  ${forbiddenFragment}
`;
