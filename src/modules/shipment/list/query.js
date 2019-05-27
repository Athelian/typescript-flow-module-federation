// @flow
import gql from 'graphql-tag';
import {
  shipmentCardFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  todoFragment,
  partnerNameFragment,
} from 'graphql';

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ShipmentFilterInput, $sortBy: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...shipmentCardFragment
      }
      page
      totalPage
    }
  }

  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${todoFragment}
  ${partnerNameFragment}
`;

export default shipmentListQuery;
