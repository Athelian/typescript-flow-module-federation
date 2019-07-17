// @flow
import gql from 'graphql-tag';
import {
  shipmentFormQueryFragment,
  ownedByFragment,
  forbiddenFragment,
  userAvatarFragment,
  customFieldsFragment,
  partnerCardFragment,
  tagFragment,
  metricFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
} from 'graphql';

export const shipmentFormQuery = gql`
  query shipmentFormQuery($id: ID!) {
    shipment(id: $id) {
      ...shipmentFormQueryFragment
      ...forbiddenFragment
    }
  }

  ${shipmentFormQueryFragment}
  ${ownedByFragment}
  ${userAvatarFragment}
  ${customFieldsFragment}
  ${partnerCardFragment}
  ${tagFragment}
  ${metricFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${forbiddenFragment}
  ${fieldDefinitionFragment}
`;

export default shipmentFormQuery;
