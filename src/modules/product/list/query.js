// @flow
import gql from 'graphql-tag';
import { productCardFragment, partnerNameFragment, tagFragment, imageFragment } from 'graphql';

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
  ${imageFragment}
`;

export default productListQuery;
