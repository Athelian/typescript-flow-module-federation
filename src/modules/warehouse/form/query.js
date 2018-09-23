// @flow
import gql from 'graphql-tag';

export const warehouseDetailFragment = gql`
  fragment warehouseDetailFragment on Warehouse {
    id
    archived
    name
    surface {
      value
      metric
    }
    street
    locality
    region
    postalCode
    country
  }
`;

export const warehouseDetailQuery = gql`
  query($id: ID!) {
    warehouse(id: $id) {
      ...warehouseDetailFragment
    }
  }
  ${warehouseDetailFragment}
`;

export default warehouseDetailQuery;
