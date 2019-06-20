// @flow
import gql from 'graphql-tag';

export const enumQuery = gql`
  query enumQuery($enumType: String!) {
    __type(name: $enumType) {
      enumValues {
        name
        description
      }
    }
  }
`;

export default enumQuery;
