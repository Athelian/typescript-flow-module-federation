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
  parseFilesField,
  parseMemoField,
} from 'utils/data';

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
  ...parseGenericField('name', originalValues?.name ?? null, newValues.name),
  ...parseDateField('dueDate', originalValues?.dueDate ?? null, newValues.dueDate),
  ...parseGenericField(
    'dueDateInterval',
    originalValues?.dueDateInterval ?? null,
    newValues.dueDateInterval
  ),
  ...parseEnumField(
    'dueDateBinding',
    originalValues?.dueDateBinding ?? null,
    newValues.dueDateBinding
  ),
  ...parseDateField(
    'estimatedCompletionDate',
    originalValues?.estimatedCompletionDate ?? null,
    newValues.estimatedCompletionDate
  ),
  ...parseGenericField(
    'estimatedCompletionDateInterval',
    originalValues?.estimatedCompletionDateInterval ?? null,
    newValues.estimatedCompletionDateInterval
  ),
  ...parseEnumField(
    'estimatedCompletionDateBinding',
    originalValues?.estimatedCompletionDateBinding ?? null,
    newValues.estimatedCompletionDateBinding
  ),
  ...parseMemoField('description', originalValues?.description ?? null, newValues.description),
  ...parseParentIdField(
    'completedById',
    originalValues?.completedBy ?? null,
    newValues.completedBy
  ),
  ...parseDateField('completedAt', originalValues?.completedAt ?? null, newValues.completedAt),
  ...parseArrayOfChildrenField(
    'tasks',
    originalValues?.tasks ?? [],
    newValues.tasks ?? [],
    (task: ?Object, newTask: Object) => ({
      ...(task ? { id: task.id } : {}),
      ...prepareParsedTaskInput(
        !task ? (originalValues?.originalTasks ?? []).find(item => item.id === newTask.id) : task,
        newTask
      ),
    })
  ),
  ...parseFilesField('files', originalValues?.files ?? [], newValues.files),
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
  ...parseGenericField('name', originalValues?.name ?? null, newValues.name),
  ...parseMemoField('description', originalValues?.description ?? null, newValues.description),
  ...parseDateField('dueDate', originalValues?.dueDate ?? null, newValues.dueDate),
  ...parseArrayOfIdsField('tagIds', originalValues?.tags ?? [], newValues.tags),
  ...parseArrayOfChildrenField(
    'milestones',
    originalValues?.milestones ?? [],
    newValues.milestones,
    (milestone: ?Object, newMilestone: Object) => ({
      ...(milestone ? { id: milestone.id } : {}),
      ...prepareParseMilestone(
        { ...milestone, originalTasks: originalValues?.originalTasks ?? [] },
        newMilestone
      ),
    })
  ),
});
