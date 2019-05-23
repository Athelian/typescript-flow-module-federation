// @flow
import gql from 'graphql-tag';
import {
  orderFormQueryFragment,
  userAvatarFragment,
  ownedByFragment,
  customFieldsFragment,
  partnerCardFragment,
  tagFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  priceFragment,
} from 'graphql';

export const orderFormQuery = gql`
  query order($id: ID!) {
    order(id: $id) {
      ...orderFormQueryFragment
    }
  }

  ${orderFormQueryFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${customFieldsFragment}
  ${partnerCardFragment}
  ${tagFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${priceFragment}
`;

export default orderFormQuery;
