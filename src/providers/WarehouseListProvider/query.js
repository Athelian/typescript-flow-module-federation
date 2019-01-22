// @flow
import gql from 'graphql-tag';

export const warehouseListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: WarehouseFilterInput) {
    warehouses(page: $page, perPage: $perPage, filterBy: $filterBy) {
      nodes {
        ... on Warehouse {
          id
          name
        }
      }
      page
      totalPage
    }
  }
`;

export default warehouseListQuery;
