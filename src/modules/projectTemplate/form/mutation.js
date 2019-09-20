// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';
import { projectTemplateFormFragment } from 'graphql/projectTemplate/fragment';

import {
  parseGenericField,
  parseArrayOfChildrenField,
  parseArrayOfIdsField,
  parseMemoField,
  parseEnumField,
} from 'utils/data';

export const projectTemplateCreateMutation: Object = gql`
  mutation projectTemplateCreateMutation($input: ProjectTemplateCreateInput!) {
    projectTemplateCreate(input: $input) {
      ...projectTemplateFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${projectTemplateFormFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const projectTemplateUpdateMutation: Object = gql`
  mutation projectTemplateUpdateMutation($id: ID!, $input: ProjectTemplateUpdateInput!) {
    projectTemplateUpdate(id: $id, input: $input) {
      ...projectTemplateFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${projectTemplateFormFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

const prepareParsedMilestoneTemplate = (originalValues: ?Object, newValues: Object): Object => ({
  ...(originalValues ? { id: originalValues.id } : {}),
  ...parseGenericField('name', originalValues?.name, newValues.name),
  ...parseMemoField('description', originalValues?.description, newValues.description),
  ...parseEnumField('dueDateBinding', originalValues?.dueDateBinding, newValues?.dueDateBinding),
  ...parseGenericField(
    'dueDateInterval',
    originalValues?.dueDateInterval,
    newValues?.dueDateInterval
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
});

export const prepareParsedProjectTemplate = (
  originalValues: ?Object,
  newValues: Object
): Object => ({
  ...parseGenericField('name', originalValues?.name, newValues.name),
  ...parseMemoField('description', originalValues?.description, newValues.description),
  ...parseArrayOfIdsField('tagIds', originalValues?.tags || [], newValues.tags),
  ...parseArrayOfChildrenField(
    'milestones',
    originalValues?.milestones || [],
    newValues.milestones,
    prepareParsedMilestoneTemplate
  ),
});
