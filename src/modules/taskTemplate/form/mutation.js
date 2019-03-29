// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const createTaskTemplateMutation = gql`
  mutation taskTemplateCreate($input: TaskTemplateCreateInput!) {
    taskTemplateCreate(input: $input) {
      ... on TaskTemplate {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const prepareTaskTemplateForCreate = ({
  name,
  description,
  entityType,
  todo,
}: Object): Object => ({
  name,
  description,
  entityType,
  tasks: todo.tasks.map(
    ({
      isNew,
      id,
      startDate,
      dueDate,
      inProgressBy,
      inProgressAt,
      completedBy,
      completedAt,
      updatedAt,
      updatedBy,
      sort,
      tags,
      assignedTo,
      ...rest
    }) => ({
      ...rest,
      ...(startDate ? { startDate } : {}),
      ...(dueDate ? { dueDate } : {}),
      assignedToIds: assignedTo.map(({ id: userId }) => userId),
      inProgressById: inProgressBy && inProgressBy.id,
      ...(inProgressAt ? { inProgressAt } : {}),
      completedById: completedBy && completedBy.id,
      ...(completedAt ? { completedAt } : {}),
      tagIds: tags.map(({ id: tagId }) => tagId),
    })
  ),
});

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
