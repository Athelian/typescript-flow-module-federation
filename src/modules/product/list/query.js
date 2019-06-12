// @flow
import gql from 'graphql-tag';
import {
  productCardWithOwnedFragment,
  productCardFragment,
  ownedByFragment,
  partnerNameFragment,
  tagFragment,
  todoFragment,
  imageFragment,
  forbiddenFragment,
} from 'graphql';

export const productListQuery = gql`
  query productListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ProductFilterInput
    $sortBy: ProductSortInput
  ) {
    products(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...productCardWithOwnedFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${productCardWithOwnedFragment}
  ${productCardFragment}
  ${ownedByFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${todoFragment}
  ${imageFragment}
  ${forbiddenFragment}
`;

export default productListQuery;
