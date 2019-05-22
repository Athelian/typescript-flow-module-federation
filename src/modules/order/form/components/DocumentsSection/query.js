// @flow
import gql from 'graphql-tag';
import { documentFragment } from 'graphql';

export const orderFormFilesQuery = gql`
  query orderFormFilesQuery($id: ID!) {
    order(id: $id) {
      ... on Order {
        id
        files {
          ...documentFragment
        }
      }
    }
  }

  ${documentFragment}
`;

export default orderFormFilesQuery;
