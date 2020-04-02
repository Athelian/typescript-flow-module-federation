import gql from 'graphql-tag';
import { forbiddenFragment, milestoneCardFragment, projectCardFragment } from 'graphql';

export const milestoneByIDQuery = gql`
  query milestoneByIDQuery($id: ID!) {
    milestone(id: $id) {
      ... on Milestone {
        ...milestoneCardFragment
        project {
          ...projectCardFragment
        }
      }
    }
  }

  ${milestoneCardFragment}
  ${projectCardFragment}
  ${forbiddenFragment}
`;
