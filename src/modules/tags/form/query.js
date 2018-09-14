// @flow
import gql from 'graphql-tag';

export const tagDetailQuery = gql`
  query($id: ID!) {
    tag(id: $id) {
      name
      description
      color
      entityTypes
      id
    }
  }
`;

export default tagDetailQuery;
