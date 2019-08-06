// @flow
import gql from 'graphql-tag';
import { documentFragment, forbiddenFragment } from 'graphql';

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
  ${forbiddenFragment}
`;

export default orderFormFilesQuery;
