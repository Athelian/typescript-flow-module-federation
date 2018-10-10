// @flow
import gql from 'graphql-tag';
import { warehouseCardFragment } from 'graphql';

export const warehouseListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: WarehouseFilterInput, $sort: WarehouseSortInput) {
    warehouses(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...warehouseCardFragment
      }
      page
      totalPage
    }
  }

  ${warehouseCardFragment}
`;

export default warehouseListQuery;
