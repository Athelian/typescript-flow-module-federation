// @flow
import gql from 'graphql-tag';

export const warehouseDetailQuery = gql`
  query($id: ID!) {
    warehouse(id: $id) {
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
    }
  }
`;

export default warehouseDetailQuery;
