// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from '../timeline/query';

export const productTimelineQuery = gql`
  query productTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    product(id: $id) {
      ... on Product {
        id
        timeline {
          entries(page: $page, perPage: $perPage) {
            nodes {
              ...commentFragment
              ...eventFragment
            }
            page
            totalPage
          }
        }
      }
    }
  }

  ${eventFragment}
  ${commentFragment}
`;

export const productExportQuery = gql`
  query productExport($id: ID!, $templateId: ID!, $fields: [String!]) {
    productExport(id: $id, templateId: $templateId, fields: $fields) {
      ... on File {
        path
      }
    }
  }
`;

export const productsExportQuery = gql`
  query productsExport(
    $filterBy: ProductFilterInput
    $sortBy: ProductSortInput
    $templateId: ID!
    $fields: [String!]
  ) {
    productsExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId, fields: $fields) {
      ... on File {
        path
      }
    }
  }
`;
