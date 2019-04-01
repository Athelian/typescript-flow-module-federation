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

export const taskTemplateCardFragment = gql`
  fragment taskTemplateCardFragment on TaskTemplate {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    name
    description
    entityType
    tasks {
      ...taskFormInTemplateFragment
    }
  }
`;

export const taskFormInTemplateFragment = gql`
  fragment taskFormInTemplateFragment on Task {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    sort
    name
    description
    tags {
      ...tagFragment
    }
    assignedTo {
      ...userAvatarFragment
    }
    taskTemplate {
      ... on TaskTemplate {
        id
      }
    }
  }
`;

export const taskFormInSlideViewFragment = gql`
  fragment taskFormInSlideViewFragment on Task {
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
    taskTemplate {
      ... on TaskTemplate {
        id
      }
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
    approvable
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
    rejectedAt
    rejectedBy {
      ...userAvatarFragment
    }
    approvedAt
    approvedBy {
      ...userAvatarFragment
    }
    assignedTo {
      ...userAvatarFragment
    }
    approvers {
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
