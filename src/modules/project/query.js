// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from 'modules/timeline/query';

export const projectTimelineQuery = gql`
  query projectTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    project(id: $id) {
      ... on Project {
        id
        timeline {
          entries(page: $page, perPage: $perPage) {
            nodes {
              ...commentFragment
              ...eventFragment
            }
            page
            totalPage
          }
        }
      }
    }
  }

  ${eventFragment}
  ${commentFragment}
`;

export const projectExportQuery = gql`
  query projectExport($id: ID!, $templateId: ID!) {
    projectExport(id: $id, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;

export const projectsExportQuery = gql`
  query projectsExport(
    $templateId: ID!
    $filterBy: ProjectFilterInput
    $sortBy: ProjectSortInput
    $localSortBy: [GenericSortInput!]
    $columns: [String!]
  ) {
    projectsExport(
      templateId: $templateId
      columns: $columns
      filterBy: $filterBy
      sortBy: $sortBy
      localSortBy: $localSortBy
    ) {
      ... on Export {
        id
      }
    }
  }
`;

export default projectTimelineQuery;
