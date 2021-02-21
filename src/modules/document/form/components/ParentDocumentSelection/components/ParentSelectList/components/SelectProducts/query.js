// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  partnerNameFragment,
  tagFragment,
  imageFragment,
  ownedByFragment,
  priceFragment,
  taskCountFragment,
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
        ... on Product {
          id
          name
          serial
          importer {
            ...partnerNameFragment
          }
          tags {
            ...tagFragment
            ...forbiddenFragment
          }
          files {
            ...imageFragment
          }
          ownedBy {
            ...ownedByFragment
          }
          productProviders {
            ... on ProductProvider {
              id
              name
              archived
              referenced
              exporter {
                ...partnerNameFragment
              }
              supplier {
                ...partnerNameFragment
              }
              unitPrice {
                ...priceFragment
              }
              todo {
                taskCount {
                  ...taskCountFragment
                }
              }
            }
          }
        }
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${priceFragment}
  ${taskCountFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${imageFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;
