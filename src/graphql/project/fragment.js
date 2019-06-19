// @flow
import gql from 'graphql-tag';

export default 1;

export const projectCardFragment = gql`
  fragment projectCardFragment on Project {
    id
    name
    description
    dueDate
    taskCount {
      count
      remain
      inProgress
      completed
      delayed
    }
    tags {
      ...tagFragment
    }
  }
`;

export const projectFragment = gql`
  fragment projectFragment on Project {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    name
    description
    dueDate
    milestones {
      ... on Milestone {
        id
      }
    }
    tags {
      ...tagFragment
    }
  }
`;
