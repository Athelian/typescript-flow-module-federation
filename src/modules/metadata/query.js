// @flow
import gql from 'graphql-tag';

export const fieldDefinitionsQuery = gql`
  query($entityType: CustomizableEntityType!) {
    fieldDefinitions(entityType: $entityType) {
      id
      name
      sort
    }
  }
`;

export default fieldDefinitionsQuery;
