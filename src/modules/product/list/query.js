// @flow
import gql from 'graphql-tag';

export const productListFragment = gql`
  fragment productListFragment on Product {
    id
    name
    status
    serial
    createdAt
    updatedAt
    exporterSuppliers {
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
    files {
      path
    }
    tags {
      id
      name
      description
      color
    }
  }
`;

export const productListQuery = gql`
  query products($filter: ProductFilterInput, $sort: SortInput, $page: Int!, $perPage: Int!) {
    viewer {
      products(filter: $filter, sort: $sort, page: $page, perPage: $perPage) {
        nodes {
          ...productListFragment
        }
        page
        totalPage
      }
    }
  }

  ${productListFragment}
`;
