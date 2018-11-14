// @flow
import gql from 'graphql-tag';

export const orderExportQuery = gql`
  query orderExport($id: ID!, $templateId: ID!, $fields: [String!]) {
    orderExport(id: $id, templateId: $templateId, fields: $fields) {
      path
    }
  }
`;

export const ordersExportQuery = gql`
  query ordersExport(
    $filterBy: OrderFilterInput
    $sortBy: OrderSortInput
    $templateId: ID!
    $fields: [String!]
  ) {
    ordersExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId, fields: $fields) {
      path
    }
  }
`;
