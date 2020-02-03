// @flow
import gql from 'graphql-tag';

export const itemQuery = gql`
  query itemQuery($id: ID!) {
    orderItem(id: $id) {
      ... on OrderItem {
        id
        files {
          ... on File {
            id
          }
        }
      }
    }
  }
`;

export default itemQuery;
