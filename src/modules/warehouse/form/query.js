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
  tagFragment,
} from 'graphql';

export const warehouseFormQuery = gql`
  query($id: ID!) {
    warehouse(id: $id) {
      ...warehouseFormFragment
    }
  }

  ${tagFragment}
  ${warehouseFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${partnerCardFragment}
`;

export default warehouseFormQuery;
