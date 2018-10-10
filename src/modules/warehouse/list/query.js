// @flow
import gql from 'graphql-tag';

export const warehouseListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: WarehouseFilterInput, $sort: WarehouseSortInput) {
    warehouses(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
        name
      }
      page
      totalPage
    }
  }
`;

export default warehouseListQuery;
