// @flow
import gql from 'graphql-tag';

export const enumQuery = gql`
  query enumQuery($enum: String!) {
    __type(name: $enum) {
      enumValues {
        name
        description
      }
    }
  }
`;

export default enumQuery;
