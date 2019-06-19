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
