// @flow
import gql from 'graphql-tag';
import {
  productCardFragment,
  partnerNameFragment,
  tagFragment,
  imageMediumFragment,
} from 'graphql';

export const productListQuery = gql`
  query products(
    $page: Int!
    $perPage: Int!
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    products(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...productCardFragment
      }
      page
      totalPage
    }
  }

  ${productCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${imageMediumFragment}
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
          }
          files {
            id
            path
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
