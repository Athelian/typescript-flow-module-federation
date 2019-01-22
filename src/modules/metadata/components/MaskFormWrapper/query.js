// @flow
import gql from 'graphql-tag';

export const maskQuery = gql`
  query($id: ID!) {
    mask(id: $id) {
      ... on Mask {
        name
        memo
        fieldDefinitions {
          ... on FieldDefinition {
            id
          }
        }
      }
    }
  }
`;

export default maskQuery;
