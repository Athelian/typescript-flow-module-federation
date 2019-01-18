// @flow
import gql from 'graphql-tag';

export const shipmentExportQuery = gql`
  query shipmentExport($id: ID!, $templateId: ID!, $fields: [String!]) {
    shipmentExport(id: $id, templateId: $templateId, fields: $fields) {
      ... on File {
        path
      }
    }
  }
`;

export const shipmentsExportQuery = gql`
  query shipmentsExport(
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
    $templateId: ID!
    $fields: [String!]
  ) {
    shipmentsExport(
      filterBy: $filterBy
      sortBy: $sortBy
      templateId: $templateId
      fields: $fields
    ) {
      ... on File {
        path
      }
    }
  }
`;
