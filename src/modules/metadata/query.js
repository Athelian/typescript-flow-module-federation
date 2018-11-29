// @flow
import gql from 'graphql-tag';
import { maskFragment, fieldDefinitionFragment } from 'graphql';

export const fieldDefinitionsQuery = gql`
  query($entityType: CustomizableEntityType!) {
    fieldDefinitions(entityType: $entityType) {
      ...fieldDefinitionFragment
    }
  }
  ${fieldDefinitionFragment}
`;

export const masksQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: MaskFilterInput) {
    masks(page: $page, perPage: $perPage, filterBy: $filter) {
      nodes {
        ...maskFragment
      }
      page
      totalPage
    }
  }
  ${maskFragment}
  ${fieldDefinitionFragment}
`;
