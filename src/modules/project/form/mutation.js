// @flow
import gql from 'graphql-tag';
import {
  projectFormFragment,
  userAvatarFragment,
  tagFragment,
  partnerCardFragment,
  documentFragment,
  shipmentCardFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  timelineDateMinimalFragment,
  portFragment,
  batchFormFragment,
  metricFragment,
  sizeFragment,
  projectCardFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
  ownedByFragment,
  taskCountFragment,
  taskWithoutParentInfoFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  containerCardFragment,
  forbiddenFragment,
} from 'graphql';
import type { ProjectCreateInput } from 'generated/graphql';
import { parseGenericField, parseDateField, parseArrayOfIdsField } from 'utils/data';
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

export const updateProjectMutation = gql`
  mutation projectUpdate($id: ID!, $input: ProjectUpdateInput!) {
    projectUpdate(id: $id, input: $input) {
      ...projectFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${projectFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${documentFragment}
  ${shipmentCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${sizeFragment}
  ${projectCardFragment}
  ${badRequestFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${taskCountFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${containerCardFragment}
  ${partnerCardFragment}
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
});
