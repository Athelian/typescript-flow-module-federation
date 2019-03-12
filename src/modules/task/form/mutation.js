// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';
import { parseDateField, parseGenericField, parseArrayOfIdsField } from 'utils/data';

export const createTaskMutation = gql`
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

export const updateTaskMutation = gql`
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

export const prepareTaskCreateDate = ({ dueDate, startDate, tags, ...rest }: Object) => ({
  ...rest,
  ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
  ...(startDate ? { startDate: new Date(startDate) } : {}),
  tagIds: tags.map(({ id: tagId }) => tagId),
});

export const prepareTaskUpdateData = (originalValues: Object, values: Object) => ({
  ...parseGenericField('name', originalValues.name, values.name),
  ...parseDateField('dueDate', originalValues.dueDate, values.dueDate),
  ...parseDateField('startDate', originalValues.startDate, values.startDate),
  // ...parseGenericField('description', originalValues.description, values.description),
  ...parseArrayOfIdsField('tagIds', originalValues.tags, values.tags),
  ...parseGenericField('memo', originalValues.memo, values.memo),
});
