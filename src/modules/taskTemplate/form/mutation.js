// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const createTaskTemplateMutation = gql`
  mutation taskCreate($input: TaskCreateInput!) {
    taskCreate(input: $input) {
      ... on Task {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const updateTaskTemplateMutation = gql`
  mutation taskUpdate($id: ID!, $input: TaskUpdateInput!) {
    taskUpdate(id: $id, input: $input) {
      ... on Task {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;
