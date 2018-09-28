// @flow
import gql from 'graphql-tag';

export const warehousesQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: WarehouseFilterInput, $sort: WarehouseSortInput) {
    warehouses(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
      }
      page
      totalPage
    }
  }
`;

export default warehousesQuery;
