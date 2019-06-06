// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';
import { parseTaskField } from 'utils/data';

export const createTaskMutation = gql`
  mutation taskCreate($input: TaskCreateInput!) {
    taskCreate(input: $input) {
      ... on Task {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const updateTaskMutation = gql`
  mutation taskUpdate($id: ID!, $input: TaskUpdateInput!) {
    taskUpdate(id: $id, input: $input) {
      ... on Task {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const prepareParsedTaskInput = (originalValues: ?Object, values: Object) => ({
  ...parseTaskField(originalValues, values),
});
