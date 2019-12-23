// @flow
import gql from 'graphql-tag';
import { documentFragment, ownedByFragment, forbiddenFragment } from 'graphql';

export const shipmentFormFilesQuery = gql`
  query shipmentFormFilesQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        files {
          ...documentFragment
          ...forbiddenFragment
        }
      }
    }
  }

  ${documentFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;

export default shipmentFormFilesQuery;
