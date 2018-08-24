// @flow
import gql from 'graphql-tag';

export const productListFragment = gql`
  fragment productListFragment on Product {
    id
    name
    archived
    serial
    createdAt
    updatedAt
    productProviders {
      id
      exporter {
        id
        name
      }
      supplier {
        id
        name
      }
    }
  }
`;

export const productListQuery = gql`
  query products($page: Int!, $perPage: Int!) {
    products(page: $page, perPage: $perPage) {
      nodes {
        ...productListFragment
      }
      page
      totalPage
    }
  }

  ${productListFragment}
`;
