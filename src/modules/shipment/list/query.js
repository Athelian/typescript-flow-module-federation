// @flow
import gql from 'graphql-tag';
import {
  shipmentCardWithOwnedFragment,
  shipmentCardFragment,
  ownedByFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  todoFragment,
  partnerNameFragment,
  badRequestFragment,
  notFoundFragment,
  forbiddenFragment,
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
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${todoFragment}
  ${partnerNameFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
  ${notFoundFragment}
`;

export default shipmentListQuery;
