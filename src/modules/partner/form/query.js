// @flow
import gql from 'graphql-tag';
import {
  partnerFormFragment,
  userAvatarFragment,
  forbiddenFragment,
  badRequestFragment,
} from 'graphql';

export const partnerQuery = gql`
  query partnerQuery($id: ID!) {
    partner(id: $id) {
      ...partnerFormFragment
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${partnerFormFragment}
  ${userAvatarFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default partnerQuery;
