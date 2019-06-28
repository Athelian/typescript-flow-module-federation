// @flow
import gql from 'graphql-tag';
import {
  projectFormQueryFragment,
  taskCardFragment,
  taskCountFragment,
  tagFragment,
  userAvatarFragment,
  ownedByFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';
import type { ProjectCreateInput } from 'generated/graphql';
import {
  parseArrayOfChildrenField,
  parseGenericField,
  parseDateField,
  parseArrayOfIdsField,
  parseParentIdField,
} from 'utils/data';
import { prepareParsedTaskInput } from 'modules/task/form/mutation';
import { getByPathWithDefault } from 'utils/fp';

export const createProjectMutation = gql`
  mutation projectCreate($input: ProjectCreateInput!) {
    projectCreate(input: $input) {
      ... on Project {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

const prepareParseMilestone = (originalValues: Object, newValues: Object): Object => ({
  ...parseGenericField('name', getByPathWithDefault(null, 'name', originalValues), newValues.name),
  ...parseDateField(
    'dueDate',
    getByPathWithDefault(null, 'dueDate', originalValues),
    newValues.dueDate
  ),
  ...parseParentIdField(
    'completedById',
    getByPathWithDefault(null, 'completedBy', originalValues),
    newValues.completedBy
  ),
  ...parseDateField(
    'completedAt',
    getByPathWithDefault(null, 'completedAt', originalValues),
    newValues.completedAt
  ),
  ...parseArrayOfChildrenField(
    'tasks',
    getByPathWithDefault([], 'tasks', originalValues),
    newValues.tasks,
    (task: ?Object, newTask: Object) => ({
      ...(!task ? {} : { id: task.id }),
      ...prepareParsedTaskInput(task, newTask),
    })
  ),
});
export const updateProjectMutation = gql`
  mutation projectUpdate($id: ID!, $input: ProjectUpdateInput!) {
    projectUpdate(id: $id, input: $input) {
      ...projectFormQueryFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${projectFormQueryFragment}
  ${taskCardFragment}
  ${taskCountFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const prepareParsedProjectInput = (
  originalValues: ?Object,
  newValues: Object
): ProjectCreateInput => ({
  ...parseGenericField('name', getByPathWithDefault(null, 'name', originalValues), newValues.name),
  ...parseGenericField(
    'description',
    getByPathWithDefault(null, 'description', originalValues),
    newValues.description
  ),
  ...parseDateField(
    'dueDate',
    getByPathWithDefault(null, 'dueDate', originalValues),
    newValues.dueDate
  ),
  ...parseArrayOfIdsField(
    'tagIds',
    getByPathWithDefault([], 'tags', originalValues),
    newValues.tags
  ),
  ...parseArrayOfChildrenField(
    'milestones',
    getByPathWithDefault([], 'milestones', originalValues),
    newValues.milestones,
    (milestone: ?Object, newMilestone: Object) => ({
      ...(!milestone ? {} : { id: milestone.id }),
      ...prepareParseMilestone(milestone, newMilestone),
    })
  ),
});
