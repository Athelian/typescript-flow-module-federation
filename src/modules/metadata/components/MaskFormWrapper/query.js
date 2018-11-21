// @flow
import gql from 'graphql-tag';

export const maskQuery = gql`
  query($id: ID!) {
    mask(id: $id) {
      name
      memo
      fieldDefinitions {
        id
      }
    }
  }
`;

export default maskQuery;
