// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  taskTemplateFormFragment,
  userAvatarFragment,
  taskFormInTemplateFragment,
  tagFragment,
  forbiddenFragment,
} from 'graphql';
import {
  parseGenericField,
  parseArrayOfChildrenField,
  parseArrayOfIdsField,
  parseMemoField,
  parseEnumField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

export const createTaskTemplateMutation: Object = gql`
  mutation taskTemplateCreate($input: TaskTemplateCreateInput!) {
    taskTemplateCreate(input: $input) {
      ...taskTemplateFormFragment
      ...badRequestFragment
    }
  }
  ${taskTemplateFormFragment}
  ${userAvatarFragment}
  ${taskFormInTemplateFragment}
  ${tagFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const updateTaskTemplateMutation: Object = gql`
  mutation taskTemplateUpdate($id: ID!, $input: TaskTemplateUpdateInput!) {
    taskTemplateUpdate(id: $id, input: $input) {
      ...taskTemplateFormFragment
      ...badRequestFragment
    }
  }
  ${taskTemplateFormFragment}
  ${userAvatarFragment}
  ${taskFormInTemplateFragment}
  ${tagFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const prepareParsedTaskTemplate = (originalValues: ?Object, newValues: Object): Object => ({
  ...parseGenericField('name', getByPathWithDefault(null, 'name', originalValues), newValues.name),
  ...parseGenericField(
    'entityType',
    getByPathWithDefault(null, 'entityType', originalValues),
    newValues.entityType
  ),
  ...parseMemoField(
    'description',
    getByPathWithDefault(null, 'description', originalValues),
    newValues.description
  ),
  ...parseArrayOfChildrenField(
    'tasks',
    getByPathWithDefault([], 'tasks', originalValues),
    newValues.tasks,
    (oldTask: ?Object, newTask: Object) => {
      return {
        ...(oldTask ? { id: oldTask.id } : {}),
        ...parseGenericField('name', getByPathWithDefault(null, 'name', oldTask), newTask.name),
        ...parseGenericField(
          'startDateInterval',
          getByPathWithDefault(null, 'startDateInterval', oldTask),
          newTask.startDateInterval
        ),
        ...parseEnumField(
          'startDateBinding',
          getByPathWithDefault(null, 'startDateBinding', oldTask),
          newTask.startDateBinding
        ),
        ...parseGenericField(
          'dueDateInterval',
          getByPathWithDefault(null, 'dueDateInterval', oldTask),
          newTask.dueDateInterval
        ),
        ...parseEnumField(
          'dueDateBinding',
          getByPathWithDefault(null, 'dueDateBinding', oldTask),
          newTask.dueDateBinding
        ),
        ...parseGenericField(
          'approvable',
          getByPathWithDefault(null, 'approvable', oldTask),
          newTask.approvable
        ),
        ...parseMemoField(
          'description',
          getByPathWithDefault(null, 'description', oldTask),
          newTask.description
        ),
        ...parseArrayOfIdsField('tagIds', getByPathWithDefault([], 'tags', oldTask), newTask.tags),
      };
    }
  ),
});
