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
} from 'graphql';

export const warehouseFormQuery = gql`
  query($id: ID!) {
    warehouse(id: $id) {
      ...warehouseFormFragment
    }
  }

  ${warehouseFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export default warehouseFormQuery;
