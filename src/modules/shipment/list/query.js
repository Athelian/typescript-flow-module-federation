// @flow
import gql from 'graphql-tag';
import {
  shipmentCardWithOwnedFragment,
  shipmentCardFragment,
  ownedByFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  metricFragment,
  taskCountFragment,
  partnerNameFragment,
  badRequestFragment,
  notFoundFragment,
  forbiddenFragment,
  userAvatarFragment,
} from 'graphql';

export const shipmentListQuery = gql`
  query shipmentListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ShipmentFilterInput
    $sortBy: ShipmentSortInput
  ) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...shipmentCardWithOwnedFragment
        ...badRequestFragment
        ...forbiddenFragment
        ...notFoundFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardWithOwnedFragment}
  ${shipmentCardFragment}
  ${ownedByFragment}
  ${userAvatarFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${metricFragment}
  ${taskCountFragment}
  ${partnerNameFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
  ${notFoundFragment}
`;

export default shipmentListQuery;
