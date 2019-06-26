// @flow
import gql from 'graphql-tag';
import {
  projectFormQueryFragment,
  milestoneCardFragment,
  taskCardFragment,
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
  ${milestoneCardFragment}
  ${taskCardFragment}
  ${taskCountFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
`;

export default projectFormQuery;
