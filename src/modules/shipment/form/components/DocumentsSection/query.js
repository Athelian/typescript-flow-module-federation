// @flow
import gql from 'graphql-tag';
import { documentFragment } from 'graphql';

export const shipmentFormFilesQuery = gql`
  query shipmentFormFilesQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        files {
          ...documentFragment
        }
      }
    }
  }

  ${documentFragment}
`;

export default shipmentFormFilesQuery;
