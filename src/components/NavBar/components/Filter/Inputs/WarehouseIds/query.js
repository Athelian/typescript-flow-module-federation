// @flow
import gql from 'graphql-tag';
import { warehouseCardFragment, forbiddenFragment } from 'graphql';

export const warehousesQuery = gql`
  query warehouses(
    $filterBy: WarehouseFilterInput
    $sortBy: WarehouseSortInput
    $page: Int!
    $perPage: Int!
  ) {
    warehouses(filterBy: $filterBy, sortBy: $sortBy, page: $page, perPage: $perPage) {
      nodes {
        ...warehouseCardFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${warehouseCardFragment}
  ${forbiddenFragment}
`;

export const warehousesByIDsQuery = gql`
  query warehousesByIDs($ids: [ID!]!) {
    warehousesByIDs(ids: $ids) {
      ... on Warehouse {
        id
        name
      }
    }
  }
`;
