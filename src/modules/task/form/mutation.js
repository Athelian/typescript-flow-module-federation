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

export const prepareTaskUpdateData = (originalValues: Object, values: Object) => ({
  ...parseGenericField('name', originalValues.name, values.name),
  ...parseGenericField('approvable', originalValues.approvable, values.approvable),
  ...parseDateField('startDate', originalValues.startDate, values.startDate),
  ...parseDateField('dueDate', originalValues.dueDate, values.dueDate),
  ...parseArrayOfIdsField('assignedToIds', originalValues.assignedTo, values.assignedTo),
  ...parseArrayOfIdsField('approverIds', originalValues.approvers, values.approvers),
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
  ...parseGenericField(
    'rejectedById',
    getByPathWithDefault(null, 'rejectedBy.id', originalValues),
    getByPathWithDefault(null, 'rejectedBy.id', values)
  ),
  ...parseDateField('rejectedAt', originalValues.rejectedAt, values.rejectedAt),
  ...parseGenericField(
    'approvedById',
    getByPathWithDefault(null, 'approvedBy.id', originalValues),
    getByPathWithDefault(null, 'approvedBy.id', values)
  ),
  ...parseDateField('approvedAt', originalValues.approvedAt, values.approvedAt),
  ...parseGenericField('description', originalValues.description, values.description),
  ...parseGenericField('memo', originalValues.memo, values.memo),
  ...parseArrayOfIdsField('tagIds', originalValues.tags, values.tags),
});
