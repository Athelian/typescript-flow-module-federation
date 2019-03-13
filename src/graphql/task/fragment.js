// @flow
import gql from 'graphql-tag';

export const taskFormFragment = gql`
  fragment taskFormFragment on Task {
    id
  }
`;

export const taskCardFragment = gql`
  fragment taskCardFragment on Task {
    id
    name
    entity {
      ... on Model {
        id
      }
      ... on Order {
        poNo
      }
      ... on Shipment {
        no
      }
      ... on Batch {
        no
      }
    }
    assignedTo {
      ...userAvatarFragment
    }
    startDate
    dueDate
    inProgressBy {
      ...userAvatarFragment
    }
    inProgressAt
    completedBy {
      ...userAvatarFragment
    }
    completedAt
    tags {
      ...tagFragment
    }
  }
`;
