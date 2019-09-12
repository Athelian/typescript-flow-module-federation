// @flow
import gql from 'graphql-tag';

export const productExportQuery = gql`
  query productExport($id: ID!, $templateId: ID!) {
    productExport(id: $id, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;

export const productsExportQuery = gql`
  query productsExport($filterBy: ProductFilterInput, $sortBy: ProductSortInput, $templateId: ID!) {
    productsExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;
