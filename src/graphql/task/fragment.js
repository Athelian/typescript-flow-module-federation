// @flow
import gql from 'graphql-tag';

export const taskCardFragment = gql`
  fragment taskCardFragment on Task {
    id
    name
    approvable
    sort
    entity {
      ... on Model {
        id
      }
      ... on Order {
        poNo
      }
      ... on OrderItem {
        no
      }
      ... on Shipment {
        no
      }
      ... on Batch {
        no
      }
      ... on Product {
        name
      }
      ... on ProductProvider {
        name
        product {
          ... on Product {
            id
            name
          }
        }
      }
    }
    assignedTo {
      ...userAvatarFragment
    }
    approvers {
      ...userAvatarFragment
    }
    startDate
    dueDate
    inProgressBy {
      ...userAvatarFragment
    }
    inProgressAt
    skippedBy {
      ...userAvatarFragment
    }
    skippedAt
    completedBy {
      ...userAvatarFragment
    }
    completedAt
    rejectedBy {
      ...userAvatarFragment
    }
    rejectedAt
    approvedBy {
      ...userAvatarFragment
    }
    approvedAt
    tags {
      ...tagFragment
    }
    milestone {
      ... on Milestone {
        id
        name
        project {
          ... on Project {
            id
            name
          }
        }
      }
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
    approvable
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    sort
    name
    startDateInterval {
      months
      weeks
      days
    }
    startDateBinding
    dueDateInterval {
      months
      weeks
      days
    }
    dueDateBinding
    description
    tags {
      ...tagFragment
    }
    assignedTo {
      ...userAvatarFragment
    }
    approvers {
      ...userAvatarFragment
    }
    taskTemplate {
      ... on TaskTemplate {
        id
      }
    }
  }
`;

export const taskWithoutParentInfoFragment = gql`
  fragment taskWithoutParentInfoFragment on Task {
    sort
    id
    approvable
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    name
    entity {
      ... on Model {
        id
      }
    }
    startDate
    startDateInterval {
      months
      weeks
      days
    }
    startDateBinding
    dueDate
    dueDateInterval {
      months
      weeks
      days
    }
    dueDateBinding
    description
    inProgressAt
    inProgressBy {
      ...userAvatarFragment
    }
    completedAt
    completedBy {
      ...userAvatarFragment
    }
    skippedAt
    skippedBy {
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
    milestone {
      ... on Milestone {
        ...milestoneCardFragment
        project {
          ...projectCardFragment
        }
      }
    }
    approvers {
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

export const taskWithParentInfoFragment = gql`
  fragment taskWithParentInfoFragment on Task {
    sort
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    name
    approvable
    startDate
    startDateInterval {
      months
      weeks
      days
    }
    startDateBinding
    dueDate
    dueDateInterval {
      months
      weeks
      days
    }
    dueDateBinding
    description
    inProgressAt
    inProgressBy {
      ...userAvatarFragment
    }
    skippedAt
    skippedBy {
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
      ... on Model {
        id
      }
    }
    order: entity {
      ... on Model {
        id
      }
      ... on Order {
        ...orderCardFragment
      }
    }
    orderItem: entity {
      ... on Model {
        id
      }
      ... on OrderItem {
        ...itemCardFragment
      }
    }
    batch: entity {
      ... on Model {
        id
      }
      ... on Batch {
        ...batchCardFragment
      }
    }
    product: entity {
      ... on Model {
        id
      }
      ... on Product {
        ...productCardFragment
      }
    }
    productProvider: entity {
      ... on Model {
        id
      }
      ... on ProductProvider {
        ...productProviderCardFragment
      }
    }
    shipment: entity {
      ... on Model {
        id
      }
      ... on Shipment {
        ...shipmentCardFragment
      }
    }
    milestone {
      ... on Milestone {
        ...milestoneCardFragment
        project {
          ...projectCardFragment
        }
      }
    }
  }
`;

export const taskTemplateFormFragment = gql`
  fragment taskTemplateFormFragment on TaskTemplate {
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

export const taskCountFragment = gql`
  fragment taskCountFragment on TaskCount {
    count
    remain
    inProgress
    completed
    rejected
    approved
    skipped
    delayed
  }
`;
