// @flow
import gql from 'graphql-tag';
import {
  productProviderCardFragment,
  productProviderFormFragment,
  userAvatarFragment,
  tagFragment,
  imageFragment,
  partnerCardFragment,
  priceFragment,
  metricFragment,
  sizeFragment,
  documentFragment,
  partnerNameFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
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
`;

export const orderItemListQuery = gql`
  query productProviders(
    $page: Int!
    $perPage: Int!
    $filter: ProductProviderFilterInput
    $sort: ProductProviderSortInput
  ) {
    productProviders(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...productProviderFormFragment
      }
      page
      totalPage
    }
  }

  ${productProviderFormFragment}
  ${userAvatarFragment}
  ${partnerCardFragment}
  ${tagFragment}
  ${imageFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${documentFragment}
`;

export default productProvidersListQuery;
