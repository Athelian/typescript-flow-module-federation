// @flow
import gql from 'graphql-tag';

export const warehousesQuery = gql`
  query($page: Int!, $perPage: Int!) {
    warehouses(page: $page, perPage: $perPage) {
      nodes {
        id
      }
      page
      totalPage
    }
  }
`;

export default warehousesQuery;
