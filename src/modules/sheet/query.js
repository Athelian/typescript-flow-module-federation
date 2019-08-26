// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';

const orderSheetFragment = gql`
  fragment orderSheetFragment on Order {
    id
    poNo
    currency
    orderItems {
      ...orderItemSheetFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const orderItemSheetFragment = gql`
  fragment orderItemSheetFragment on OrderItem {
    id
    no
    quantity
    batches {
      ...batchSheetFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const batchSheetFragment = gql`
  fragment batchSheetFragment on Batch {
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

export const orderSheetQuery = gql`
  query orderSheetQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
  ) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderSheetFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${orderSheetFragment}
  ${orderItemSheetFragment}
  ${batchSheetFragment}
  ${forbiddenFragment}
`;
