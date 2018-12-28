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
    $filter: ProductProviderFilterInput
    $sort: ProductProviderSortInput
  ) {
    productProviders(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
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
