// @flow
import gql from 'graphql-tag';

const userListFragment = gql`
  fragment userListFields on User {
    firstName
    lastName
  }
`;

export const batchItemListFragment = gql`
  fragment batchItemListFields on Batch {
    id
    createdAt
    updatedAt
    no
    archived
    quantity
    deliveredAt
    tags {
      id
      name
      description
      color
    }
    batchAdjustments {
      id
      reason
      quantity
      memo
    }
    batchAssignments {
      id
      quantity
      user {
        ...userListFields
      }
      memo
    }
    orderItem {
      id
      order {
        id
        poNo
        exporter {
          id
          name
        }
      }
      productProvider {
        id
        product {
          id
          name
          serial
        }
      }
    }
  }

  ${userListFragment}
`;

export const batchItemListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    batches(page: $page, perPage: $perPage) {
      nodes {
        ...batchItemListFields
      }
      page
      totalPage
    }
  }

  ${batchItemListFragment}
`;
