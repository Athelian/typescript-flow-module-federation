// @flow
import gql from 'graphql-tag';
import {
  warehouseFormFragment,
  userAvatarFragment,
  metricFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  partnerCardFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';
import {
  parseGenericField,
  parseEnumField,
  parseArrayOfIdsField,
  parseCustomFieldsField,
} from 'utils/data';
import { getByPathWithDefault } from 'utils/fp';

export const createWarehouseMutation = gql`
  mutation warehouseCreate($input: WarehouseCreateInput!) {
    warehouseCreate(input: $input) {
      ... on Warehouse {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const updateWarehouseMutation = gql`
  mutation warehouseUpdate($id: ID!, $input: WarehouseUpdateInput!) {
    warehouseUpdate(id: $id, input: $input) {
      ...warehouseFormFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${warehouseFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${partnerCardFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const prepareParsedWarehouseInput = (
  originalValues: ?Object,
  newValues: Object
): Object => ({
  ...parseGenericField('name', getByPathWithDefault(null, 'name', originalValues), newValues.name),
  ...parseGenericField(
    'street',
    getByPathWithDefault(null, 'street', originalValues),
    newValues.street
  ),
  ...parseGenericField(
    'locality',
    getByPathWithDefault(null, 'locality', originalValues),
    newValues.locality
  ),
  ...parseGenericField(
    'region',
    getByPathWithDefault(null, 'region', originalValues),
    newValues.region
  ),
  ...parseGenericField(
    'postalCode',
    getByPathWithDefault(null, 'postalCode', originalValues),
    newValues.postalCode
  ),
  ...parseEnumField(
    'country',
    getByPathWithDefault(null, 'country', originalValues),
    newValues.country
  ),
  ...parseGenericField(
    'surface',
    getByPathWithDefault(null, 'surface', originalValues),
    newValues.surface
  ),
  ...parseCustomFieldsField(
    'customFields',
    getByPathWithDefault(null, 'customFields', originalValues),
    newValues.customFields
  ),
  ...parseArrayOfIdsField(
    'organizationIds',
    getByPathWithDefault([], 'organizations', originalValues),
    newValues.organizations
  ),
});
