// @flow
import gql from 'graphql-tag';
import {
  userAvatarFragment,
  tagFragment,
  productCardFragment,
  productProviderCardFragment,
  orderCardFragment,
  itemCardFragment,
  batchCardFragment,
  shipmentCardFragment,
  partnerNameFragment,
  priceFragment,
  metricFragment,
  imageFragment,
  timelineDateMinimalFragment,
  portFragment,
  taskCountFragment,
  sizeFragment,
  ownedByFragment,
  badRequestFragment,
  forbiddenFragment,
  productProviderPackagingFragment,
} from 'graphql';
import { projectFormQueryFragment } from 'graphql/project/fragment';

import type { Task, ProjectCreateInput } from 'generated/graphql';
import {
  parseArrayOfChildrenField,
  parseGenericField,
  parseDateField,
  parseArrayOfIdsField,
  parseParentIdField,
  parseTaskField,
  parseEnumField,
} from 'utils/data';

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

export const deleteTaskMutation = gql`
  mutation taskDelete($id: ID!) {
    taskDelete(id: $id) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const prepareParsedTaskInput = (originalValues: ?Task, values: Task) => ({
  ...(!values ? {} : { id: values.id }),
  ...parseTaskField(originalValues, values, true),
});

const prepareParseMilestone = (originalValues: Object, newValues: Object): Object => ({
  ...parseGenericField('name', getByPathWithDefault(null, 'name', originalValues), newValues.name),
  ...parseDateField('dueDate', originalValues?.dueDate, newValues?.dueDate),
  ...parseGenericField(
    'dueDateInterval',
    originalValues?.dueDateInterval,
    newValues?.dueDateInterval
  ),
  ...parseEnumField('dueDateBinding', originalValues?.dueDateBinding, newValues?.dueDateBinding),
  ...parseDateField(
    'estimatedCompletionDate',
    originalValues?.estimatedCompletionDate,
    newValues?.estimatedCompletionDate
  ),
  ...parseGenericField(
    'estimatedCompletionDateInterval',
    originalValues?.estimatedCompletionDateInterval,
    newValues?.estimatedCompletionDateInterval
  ),
  ...parseEnumField(
    'estimatedCompletionDateBinding',
    originalValues?.estimatedCompletionDateBinding,
    newValues?.estimatedCompletionDateBinding
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
    originalValues?.tasks || [],
    newValues?.tasks || [],
    (task: ?Object, newTask: Object) => ({
      ...(task ? { id: task.id } : {}),
      ...prepareParsedTaskInput(
        !task ? originalValues.originalTasks.find(item => item.id === newTask.id) : task,
        newTask
      ),
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

  ${taskCountFragment}
  ${tagFragment}
  ${ownedByFragment}
  ${orderCardFragment}
  ${productCardFragment}
  ${productProviderCardFragment}
  ${batchCardFragment}
  ${shipmentCardFragment}
  ${itemCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${metricFragment}
  ${imageFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${sizeFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
  ${productProviderPackagingFragment}
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
      ...(milestone ? { id: milestone.id } : {}),
      ...prepareParseMilestone(
        { ...milestone, originalTasks: (originalValues && originalValues.originalTasks) || [] },
        newMilestone
      ),
    })
  ),
});
