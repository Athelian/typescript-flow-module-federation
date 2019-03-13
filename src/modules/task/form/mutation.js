// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';
import { parseDateField, parseGenericField, parseArrayOfIdsField } from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

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
  ...parseDateField('startDate', originalValues.startDate, values.startDate),
  ...parseDateField('dueDate', originalValues.dueDate, values.dueDate),
  ...parseArrayOfIdsField('assignedToIds', originalValues.assignedTo, values.assignedTo),
  ...parseGenericField(
    'inProgressById',
    getByPathWithDefault(null, 'inProgressBy.id', originalValues),
    getByPathWithDefault(null, 'inProgressBy.id', values)
  ),
  ...parseDateField('inProgressAt', originalValues.inProgressAt, values.inProgressAt),
  ...parseGenericField(
    'completedById',
    getByPathWithDefault(null, 'completedBy.id', originalValues),
    getByPathWithDefault(null, 'completedBy.id', values)
  ),
  ...parseDateField('completedAt', originalValues.completedAt, values.completedAt),
  // ...parseGenericField('description', originalValues.description, values.description),
  ...parseGenericField('memo', originalValues.memo, values.memo),
  ...parseArrayOfIdsField('tagIds', originalValues.tags, values.tags),
});
