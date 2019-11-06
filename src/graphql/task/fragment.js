// @flow
import gql from 'graphql-tag';
import { userAvatarFragment, tagFragment, ownedByFragment } from 'graphql/common/fragment';

const taskInfoFragment = gql`
  fragment taskInfoFragment on Task {
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
    tags {
      ...tagFragment
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
    assignedTo {
      ...userAvatarFragment
    }
    approvable
    rejectedAt
    rejectedBy {
      ...userAvatarFragment
    }
    approvedAt
    approvedBy {
      ...userAvatarFragment
    }
    approvers {
      ...userAvatarFragment
    }
  }
  ${userAvatarFragment}
  ${ownedByFragment}
  ${tagFragment}
`;

const taskEntityCardFragment = gql`
  fragment taskEntityCardFragment on Task {
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
  }
`;

export const taskCardFragment = gql`
  fragment taskCardFragment on Task {
    id
    name
    approvable
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
    startDateBinding
    dueDateBinding
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
  ${userAvatarFragment}
  ${tagFragment}
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
    ...taskInfoFragment
    milestone {
      ... on Milestone {
        ...milestoneCardFragment
        project {
          ...projectCardFragment
        }
      }
    }

    taskTemplate {
      ... on TaskTemplate {
        id
      }
    }
  }
  ${taskInfoFragment}
`;

export const taskFormInProjectFragment = gql`
  fragment taskFormInProjectFragment on Task {
    ...taskInfoFragment
    ...taskEntityCardFragment
  }
  ${taskInfoFragment}
  ${taskEntityCardFragment}
`;

export const taskWithParentInfoFragment = gql`
  fragment taskWithParentInfoFragment on Task {
    ...taskInfoFragment
    ...taskEntityCardFragment

    milestone {
      ... on Milestone {
        ...milestoneCardFragment
        project {
          ...projectCardFragment
        }
      }
    }
  }
  ${taskInfoFragment}
  ${taskEntityCardFragment}
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
