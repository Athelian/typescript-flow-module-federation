// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from '../timeline/query';

export const taskTimelineQuery = gql`
  query taskTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    task(id: $id) {
      ... on Task {
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

export const taskExportQuery = gql`
  query taskExport($id: ID!, $templateId: ID!) {
    taskExport(id: $id, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;

export const tasksExportQuery = gql`
  query tasksExport($filterBy: TaskFilterInput, $sortBy: TaskSortInput, $templateId: ID!) {
    tasksExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;
