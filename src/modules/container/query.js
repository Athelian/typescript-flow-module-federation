// @flow
import gql from 'graphql-tag';

export const containerExportQuery = gql`
  query containerExport($id: ID!, $templateId: ID!) {
    containerExport(id: $id, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;

export const containersExportQuery = gql`
  query containersExport(
    $filterBy: ContainerFilterInput
    $sortBy: ContainerSortInput
    $templateId: ID!
  ) {
    containersExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;
