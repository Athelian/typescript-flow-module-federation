// @flow
import gql from 'graphql-tag';

export const warehouseDetailFragment = gql`
  fragment warehouseDetailFragment on Warehouse {
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
    id
    updatedAt
    updatedBy {
      id
      firstName
      lastName
    }
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
