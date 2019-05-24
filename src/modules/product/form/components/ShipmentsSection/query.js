import gql from 'graphql-tag';
import {
  shipmentCardFragment,
  timelineDateMinimalFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  todoFragment,
} from 'graphql';

export const shipmentsInProductQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ShipmentFilterInput, $sortBy: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Shipment {
          ...shipmentCardFragment
        }
      }
      totalCount
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
`;

export default shipmentsInProductQuery;
