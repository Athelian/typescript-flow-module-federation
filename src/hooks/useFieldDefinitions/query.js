// @flow
import gql from 'graphql-tag';

export const fieldDefinitionsQuery = gql`
  query fieldDefinitionsQuery($entityType: CustomizableEntityType!) {
    fieldDefinitions(entityType: $entityType) {
      ... on FieldDefinition {
        id
        name
        sort
        entityType
      }
    }
  }
`;

export default fieldDefinitionsQuery;
