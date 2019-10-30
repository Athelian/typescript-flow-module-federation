// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from '../timeline/query';

export const containerTimelineQuery = gql`
  query containerTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    container(id: $id) {
      ... on Container {
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

export const containerExportQuery = gql`
  query containerExport($id: ID!, $templateId: ID!) {
    containerExport(id: $id, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;

export const containersExportQuery = gql`
  query containersExport(
    $filterBy: ContainerFilterInput
    $sortBy: ContainerSortInput
    $templateId: ID!
  ) {
    containersExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;
