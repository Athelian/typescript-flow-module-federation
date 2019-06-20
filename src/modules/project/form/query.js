// @flow
import gql from 'graphql-tag';

import { projectFragment, tagFragment, userAvatarFragment, ownedByFragment } from 'graphql';

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

export default projectFormQuery;
