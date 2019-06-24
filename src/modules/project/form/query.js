// @flow
import gql from 'graphql-tag';
import {
  projectFormQueryFragment,
  taskCountFragment,
  tagFragment,
  userAvatarFragment,
  ownedByFragment,
} from 'graphql';

export const projectFormQuery = gql`
  query projectFormQuery($id: ID!) {
    project(id: $id) {
      ...projectFormQueryFragment
    }
  }

  ${projectFormQueryFragment}
  ${taskCountFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
`;

export default projectFormQuery;
