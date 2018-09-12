// @flow
import gql from 'graphql-tag';

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    shipments(page: $page, perPage: $perPage) {
      nodes {
        id
      }
      page
      totalPage
    }
  }
`;

export default shipmentListQuery;
