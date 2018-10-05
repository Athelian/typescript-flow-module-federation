// @flow
import gql from 'graphql-tag';

export const timelineDateFragment = gql`
  fragment timelineDateFragment on TimelineDate {
    date
    assignedTo {
      firstName
      lastName
      id
    }
    approvedBy {
      firstName
      lastName
      id
    }
    approvedAt
    timelineDateRevisions {
      date
      type
      memo
      id
      updatedAt
      updatedBy {
        firstName
        lastName
        id
      }
      sort
    }
    id
  }
`;

export default timelineDateFragment;
