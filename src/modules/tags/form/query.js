// @flow
import gql from 'graphql-tag';
import { tagFormFragment, userAvatarFragment, ownedByFragment } from 'graphql';

export const tagFormQuery = gql`
  query($id: ID!) {
    tag(id: $id) {
      ...tagFormFragment
    }
  }

  ${tagFormFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
`;

export default tagFormQuery;
