// @flow
import gql from 'graphql-tag';

export const productListFragment = gql`
  fragment productListFragment on Product {
    name
    serial
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
    id
    tags {
      id
      name
      color
    }
    files {
      id
      path
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

export const productProvidersQuery = gql`
  query productProviders(
    $page: Int!
    $perPage: Int!
    $filter: ProductProviderFilterInput
    $sort: ProductProviderSortInput
  ) {
    productProviders(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
        exporter {
          id
          name
        }
        supplier {
          id
          name
        }
        product {
          id
          name
          serial
          tags {
            id
            name
            color
            description
          }
        }
        unitPrice {
          amount
          currency
        }
      }
      page
      totalPage
    }
  }
`;
