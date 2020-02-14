// @flow
import gql from 'graphql-tag';
import { warehouseCardFragment } from 'graphql';

export const warehouseListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: WarehouseFilterInput, $sortBy: WarehouseSortInput) {
    warehouses(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
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
