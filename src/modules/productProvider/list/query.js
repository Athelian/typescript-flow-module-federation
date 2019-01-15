// @flow
import gql from 'graphql-tag';
import {
  productProviderCardFragment,
  tagFragment,
  imageFragment,
  priceFragment,
  partnerNameFragment,
  metricFragment,
  sizeFragment,
} from 'graphql';

export const productProvidersListQuery = gql`
  query productProviders(
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
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
`;

export default productProvidersListQuery;
