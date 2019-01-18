// @flow
import gql from 'graphql-tag';

export const ordersByIDsExportQuery = gql`
  query ordersByIDsExport($ids: [ID!]!, $templateId: ID!, $fields: [String!]) {
    ordersByIDsExport(ids: $ids, templateId: $templateId, fields: $fields) {
      ... on File {
        path
      }
    }
  }
`;

export default ordersByIDsExportQuery;
