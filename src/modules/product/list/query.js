// @flow
import gql from 'graphql-tag';
import {
  productCardFragment,
  partnerNameFragment,
  tagFragment,
  todoFragment,
  imageFragment,
  ownedByFragment,
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
        ...productCardFragment
      }
      page
      totalPage
    }
  }

  ${productCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${todoFragment}
  ${imageFragment}
  ${ownedByFragment}
`;

export default productListQuery;
