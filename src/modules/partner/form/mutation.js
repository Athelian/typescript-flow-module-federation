// @flow
import gql from 'graphql-tag';
import {
  partnerFormFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';
import { parseGenericField, parseArrayOfIdsField } from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

export const updatePartnerMutation = gql`
  mutation partnerUpdate($id: ID!, $input: PartnerUpdateInput!) {
    partnerUpdate(id: $id, input: $input) {
      ...partnerFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${partnerFormFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const prepareParsedPartnerInput = (originalValues: ?Object, newValues: Object): Object => ({
  ...parseGenericField('name', getByPathWithDefault(null, 'name', originalValues), newValues.name),
  ...parseGenericField('code', getByPathWithDefault(null, 'code', originalValues), newValues.code),
  ...parseArrayOfIdsField(
    'types',
    getByPathWithDefault([], 'types', originalValues),
    newValues.types
  ),
  ...parseArrayOfIdsField(
    'tagIds',
    getByPathWithDefault([], 'tagIds', originalValues),
    newValues.tagIds
  ),
});
