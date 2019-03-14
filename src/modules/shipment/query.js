// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from '../timeline/query';

export const shipmentTimelineQuery = gql`
  query shipmentTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    shipment(id: $id) {
      ... on Shipment {
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
