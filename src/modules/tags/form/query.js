// @flow
import gql from 'graphql-tag';
import { tagFormFragment, userAvatarFragment } from 'graphql';

export const tagFormQuery = gql`
  query($id: ID!) {
    tag(id: $id) {
      ...tagFormFragment
    }
  }

  ${tagFormFragment}
  ${userAvatarFragment}
`;

export default tagFormQuery;
