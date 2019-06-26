/* eslint-disable graphql/template-strings */
// @flow
import gql from 'graphql-tag';

export const tagExportQuery = gql`
  query tagExport($id: ID!, $templateId: ID!) {
    tagExport(id: $id, templateId: $templateId) {
      ... on File {
        path
      }
    }
  }
`;

export const tagsExportQuery = gql`
  query tagsExport($filterBy: TagFilterInput, $sortBy: TagSortInput, $templateId: ID!) {
    tagsExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId) {
      ... on File {
        path
      }
    }
  }
`;
