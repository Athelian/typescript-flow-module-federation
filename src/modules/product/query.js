// @flow
import gql from 'graphql-tag';

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
