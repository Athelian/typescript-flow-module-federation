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

export const masksQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: MaskFilterInput) {
    masks(page: $page, perPage: $perPage, filterBy: $filter) {
      nodes {
        id
        name
        memo
        entityType
        fieldDefinitions {
          id
        }
      }
      page
      totalPage
    }
  }
`;
