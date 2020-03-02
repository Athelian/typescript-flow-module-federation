// @flow
import gql from 'graphql-tag';
import {
  partnerFormFragment,
  userAvatarFragment,
  tagFragment,
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
  ${tagFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default partnerQuery;
