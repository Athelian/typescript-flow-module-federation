// @flow
import gql from 'graphql-tag';
import {
  partnerFormFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
} from 'graphql';

export const partnerFormQuery = gql`
  query($id: ID!) {
    partner(id: $id) {
      ...partnerFormFragment
    }
  }

  ${partnerFormFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
`;

export default partnerFormQuery;
