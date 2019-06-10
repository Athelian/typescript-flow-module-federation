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
        ...forbiddenFragment
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
`;

export default shipmentListQuery;
