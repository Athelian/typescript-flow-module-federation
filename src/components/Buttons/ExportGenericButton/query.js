/* eslint-disable graphql/template-strings */
// @flow
import gql from 'graphql-tag';

export const exportExtensionsQuery = gql`
  query {
    exportExtensions {
      ... on ExportExtension {
        extension
      }
    }
  }
`;

export const genericExportQuery = gql`
  query genericExport($extension: String!, $columns: [String!]!, $rows: [[String]!]!) {
    genericExport(extension: $extension, columns: $columns, rows: $rows) {
      ... on Export {
        id
      }
    }
  }
`;
