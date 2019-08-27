// @flow
import gql from 'graphql-tag';
import {
  imageFragment,
  partnerNameFragment,
  metricFragment,
  sizeFragment,
  taskCountFragment,
  tagFragment,
  productProviderPackagingFragment,
  priceFragment,
  productProviderCardFragment,
} from 'graphql';

export const productProvidersListQuery = gql`
  query productProvidersListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ProductProviderFilterInput
    $sortBy: ProductProviderSortInput
  ) {
    productProviders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...productProviderCardFragment
        ... on ProductProvider {
          id
          product {
            ... on Product {
              id
              tags {
                ... on Tag {
                  id
                  name
                  color
                  entityTypes
                }
              }
            }
          }
        }
      }
      page
      totalPage
    }
  }

  ${productProviderCardFragment}
  ${priceFragment}
  ${productProviderPackagingFragment}
  ${partnerNameFragment}
  ${imageFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${taskCountFragment}
`;

export default productProvidersListQuery;
