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
  forbiddenFragment,
} from 'graphql';

export const orderFormQuery = gql`
  query orderFormQuery($id: ID!) {
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
  ${forbiddenFragment}
`;

export default orderFormQuery;
