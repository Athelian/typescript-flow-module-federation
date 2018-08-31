// @flow
import gql from 'graphql-tag';

const userListFragment = gql`
  fragment userListFields on User {
    firstName
    lastName
  }
`;

export const batchListFragment = gql`
  fragment batchListFields on Batch {
    id
    no
    quantity
    deliveredAt
    tags {
      id
      name
      color
    }
    batchAdjustments {
      id
      quantity
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

export const batchListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    batches(page: $page, perPage: $perPage) {
      nodes {
        ...batchListFields
      }
      page
      totalPage
    }
  }

  ${batchListFragment}
`;
