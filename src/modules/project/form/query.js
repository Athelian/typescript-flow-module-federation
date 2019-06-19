// @flow
import gql from 'graphql-tag';

import { projectFragment, tagFragment, userAvatarFragment, ownedByFragment } from 'graphql';

export default 1;

export const projectFormQuery = gql`
  query projectFormQuery($id: ID!) {
    project(id: $id) {
      ...projectFragment
    }
  }

  ${projectFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
`;
