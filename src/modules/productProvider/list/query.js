// @flow
import gql from 'graphql-tag';
import {
  productProviderCardFragment,
  tagFragment,
  imageFragment,
  partnerNameFragment,
  metricFragment,
  sizeFragment,
  taskCountFragment,
  productProviderPackagingFragment,
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
      }
      page
      totalPage
    }
  }

  ${productProviderCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${imageFragment}
  ${metricFragment}
  ${sizeFragment}
  ${taskCountFragment}
  ${productProviderPackagingFragment}
`;

export default productProvidersListQuery;
