// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';

export const updateFieldDefinitionsMutation = gql`
  mutation fieldDefinitionsUpdate($input: FieldDefinitionsInput!) {
    fieldDefinitionsUpdate(input: $input) {
      fieldDefinitions {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export default updateFieldDefinitionsMutation;
