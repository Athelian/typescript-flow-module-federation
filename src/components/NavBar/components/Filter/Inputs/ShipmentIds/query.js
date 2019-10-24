// @flow
import gql from 'graphql-tag';
import {
  shipmentCardFragment,
  partnerNameFragment,
  tagFragment,
  userAvatarFragment,
  taskCountFragment,
  forbiddenFragment,
  timelineDateMinimalFragment,
  portFragment,
  metricFragment,
} from 'graphql';

export const shipmentsQuery = gql`
  query shipments(
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
    $page: Int!
    $perPage: Int!
  ) {
    shipments(filterBy: $filterBy, sortBy: $sortBy, page: $page, perPage: $perPage) {
      nodes {
        ...shipmentCardFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${metricFragment}
  ${partnerNameFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${taskCountFragment}
  ${forbiddenFragment}
`;

export const shipmentsByIDsQuery = gql`
  query shipmentsByIDs($ids: [ID!]!) {
    shipmentsByIDs(ids: $ids) {
      ... on Shipment {
        id
        no
      }
    }
  }
`;
