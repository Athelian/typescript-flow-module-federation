// @flow
import gql from 'graphql-tag';

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: ShipmentFilterInput, $sort: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
      }
      page
      totalPage
    }
  }
`;

export default shipmentListQuery;
