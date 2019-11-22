// @flow
import gql from 'graphql-tag';
import {
  productCardFragment,
  forbiddenFragment,
  ownedByFragment,
  partnerNameFragment,
  tagFragment,
  taskCountFragment,
  imageFragment,
} from 'graphql';

export const productsQuery = gql`
  query products(
    $filterBy: ProductFilterInput
    $sortBy: ProductSortInput
    $page: Int!
    $perPage: Int!
  ) {
    products(filterBy: $filterBy, sortBy: $sortBy, page: $page, perPage: $perPage) {
      nodes {
        ...productCardFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${productCardFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${taskCountFragment}
  ${imageFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;

export const productsByIDsQuery = gql`
  query productsByIDs($ids: [ID!]!) {
    productsByIDs(ids: $ids) {
      ... on Product {
        id
        name
      }
    }
  }
`;
