// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from 'modules/timeline/query';

export const batchTimelineQuery = gql`
  query batchTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    batch(id: $id) {
      ... on Batch {
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

export const batchExportQuery = gql`
  query batchExport($id: ID!, $templateId: ID!) {
    batchExport(id: $id, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;

export const batchesExportQuery = gql`
  query batchesExport(
    $templateId: ID!
    $filterBy: BatchFilterInput
    $sortBy: BatchSortInput
    $localSortBy: [GenericSortInput!]
    $columns: [String!]
  ) {
    batchesExport(
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
