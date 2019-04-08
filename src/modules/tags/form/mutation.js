// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';
import { parseGenericField, parseMemoField } from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

export const createTagMutation = gql`
  mutation tagCreate($input: TagCreateInput!) {
    tagCreate(input: $input) {
      ... on Tag {
        id
      }
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const updateTagMutation = gql`
  mutation tagUpdate($id: ID!, $input: TagUpdateInput!) {
    tagUpdate(id: $id, input: $input) {
      ... on Tag {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const prepareParsedTagInput = (originalValues: Object, newValues: Object): Object => ({
  ...parseGenericField('name', getByPathWithDefault(null, 'name', originalValues), newValues.name),
  ...parseMemoField(
    'description',
    getByPathWithDefault(null, 'description', originalValues),
    newValues.description
  ),
  ...parseGenericField(
    'color',
    getByPathWithDefault(null, 'color', originalValues),
    newValues.color
  ),
  ...parseGenericField(
    'entityTypes',
    getByPathWithDefault(null, 'entityTypes', originalValues),
    newValues.entityTypes
  ),
});
