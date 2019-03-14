// @flow
import gql from 'graphql-tag';

export const taskCardFragment = gql`
  fragment taskCardFragment on Task {
    id
    name
    sort
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

export const taskFormFragment = gql`
  fragment taskFormFragment on Task {
    sort
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    name
    dueDate
    startDate
    description
    inProgressAt
    inProgressBy {
      ...userAvatarFragment
    }
    completedAt
    completedBy {
      ...userAvatarFragment
    }
    assignedTo {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
    }
    memo
    entity {
      ... on Order {
        ...orderCardFragment
      }
      ... on Batch {
        ...batchCardFragment
      }
      ... on Shipment {
        ...shipmentCardFragment
      }
    }
  }
`;

export const todoFragment = gql`
  fragment todoFragment on Todo {
    completedCount
    inProgressCount
    remainingCount
  }
`;
