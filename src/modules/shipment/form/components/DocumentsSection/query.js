// @flow
import gql from 'graphql-tag';
import { documentFragment, tagFragment, ownedByFragment, forbiddenFragment } from 'graphql';

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
  ${tagFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;

export default shipmentFormFilesQuery;
