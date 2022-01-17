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
  query shipmentExport($id: ID!, $templateId: ID!) {
    shipmentExport(id: $id, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;

export const shipmentsExportQuery = gql`
  query shipmentsExport(
    $templateId: ID!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
    $localSortBy: [GenericSortInput!]
    $columns: [String!]
  ) {
    shipmentsExport(
      templateId: $templateId
      columns: $columns
      filterBy: $filterBy
      sortBy: $sortBy
      localSortBy: $localSortBy
    ) {
      ... on Export {
        id
      }
    }
  }
`;

/**
 * retrieves the filters of a specific view
 * initial value for filterSort for first time users is ""
 */
export const getShipmentViewStateQuery = gql`
  query viewState($type: ViewStateType!) {
    viewState(type: $type) {
      ... on ViewState {
        id
        type
        filterSort
      }
    }
  }
`;
