// @flow
import gql from 'graphql-tag';
import {
  productProviderCardFragment,
  forbiddenFragment,
  partnerNameFragment,
  tagFragment,
  taskCountFragment,
  imageFragment,
  priceFragment,
  productProviderPackagingFragment,
  metricFragment,
  sizeFragment,
} from 'graphql';

export const productProvidersQuery = gql`
  query productProviders(
    $filterBy: ProductProviderFilterInput
    $sortBy: ProductProviderSortInput
    $page: Int!
    $perPage: Int!
  ) {
    productProviders(filterBy: $filterBy, sortBy: $sortBy, page: $page, perPage: $perPage) {
      nodes {
        ...productProviderCardFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${productProviderCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${productProviderPackagingFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${taskCountFragment}
  ${imageFragment}
  ${forbiddenFragment}
`;

export const productProvidersByIDsQuery = gql`
  query productProvidersByIDs($ids: [ID!]!) {
    productProvidersByIDs(ids: $ids) {
      ... on ProductProvider {
        id
        name
      }
    }
  }
`;
