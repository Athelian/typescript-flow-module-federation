// @flow
import gql from 'graphql-tag';
import { tagFormFragment, userAvatarFragment } from 'graphql';

export const tagFormQuery = gql`
  query($id: ID!) {
    tag(id: $id) {
      ...tagFormFragment
      ... on Tag {
        ownedBy {
          ... on Group {
            id
            name
          }
        }
      }
    }
  }

  ${tagFormFragment}
  ${userAvatarFragment}
`;

export default tagFormQuery;
