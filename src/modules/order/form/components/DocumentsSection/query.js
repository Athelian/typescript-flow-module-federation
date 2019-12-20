// @flow
import gql from 'graphql-tag';
import { documentFragment, ownedByFragment, forbiddenFragment } from 'graphql';

export const orderFormFilesQuery = gql`
  query orderFormFilesQuery($id: ID!) {
    order(id: $id) {
      ... on Order {
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

export default orderFormFilesQuery;
