// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const updateFieldDefinitionsMutation = gql`
  mutation fieldDefinitionsUpdate($input: FieldDefinitionsInput!) {
    fieldDefinitionsUpdate(input: $input) {
      ... on FieldDefinitions {
        fieldDefinitions {
          id
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export default updateFieldDefinitionsMutation;
