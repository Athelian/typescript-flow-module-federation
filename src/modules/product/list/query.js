// @flow
import gql from 'graphql-tag';
import { productCardFragment, partnerNameFragment, tagFragment, imageFragment } from 'graphql';

export const productListQuery = gql`
  query products(
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
  ${imageFragment}
`;

export default productListQuery;
