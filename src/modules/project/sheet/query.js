/* eslint-disable graphql/template-strings */
// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  forbiddenFragment,
  userAvatarFragment,
  documentFragment,
  documentSummaryFragment,
  tagFragment,
  ownedByFragment,
  partnerCardFragment,
} from 'graphql';

const projectSheetFragment = gql`
  fragment projectSheetFragment on Project {
    id
    name
    description
    dueDate
    archived
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    organizations {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    followers {
      ...userAvatarFragment
    }
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
        name
      }
    }
  }
`;

const milestoneSheetFragment = gql`
  fragment milestoneSheetFragment on Milestone {
    id
    name
    description
    dueDate
    dueDateBinding
    dueDateInterval {
      days
      weeks
      months
    }
    estimatedCompletionDate
    estimatedCompletionDateBinding
    estimatedCompletionDateInterval {
      days
      weeks
      months
    }
    completedAt
    completedBy {
      ...userAvatarFragment
    }
    files @include(if: $isSummary) {
      ...documentSummaryFragment
      ...forbiddenFragment
      __typename
    }
    files @skip(if: $isSummary) {
      ...documentFragment
      ...forbiddenFragment
      __typename
    }
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

const taskSheetFragment = gql`
  fragment taskSheetFragment on Task {
    id
    name
    entity {
      __typename
    }
    order: entity {
      ... on Order {
        importer {
          ... on Organization {
            id
          }
        }
        exporter {
          ... on Organization {
            id
          }
        }
      }
    }
    orderItem: entity {
      ... on OrderItem {
        order {
          ... on Order {
            importer {
              ... on Organization {
                id
              }
            }
            exporter {
              ... on Organization {
                id
              }
            }
          }
        }
      }
    }
    batch: entity {
      ... on Batch {
        orderItem {
          ... on OrderItem {
            order {
              ... on Order {
                importer {
                  ... on Organization {
                    id
                  }
                }
                exporter {
                  ... on Organization {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
    shipment: entity {
      ... on Shipment {
        importer {
          ... on Organization {
            id
          }
        }
        exporter {
          ... on Organization {
            id
          }
        }
      }
    }
    productProvider: entity {
      ... on ProductProvider {
        exporter {
          ... on Organization {
            id
          }
        }
        product {
          ... on Product {
            importer {
              ... on Organization {
                id
              }
            }
          }
        }
      }
    }
    description
    startDate
    startDateBinding
    startDateInterval {
      days
      weeks
      months
    }
    dueDate
    dueDateBinding
    dueDateInterval {
      days
      weeks
      months
    }
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
    skippedAt
    skippedBy {
      ...userAvatarFragment
    }
    approvable
    approvedAt
    approvedBy {
      ...userAvatarFragment
    }
    approvers {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    createdAt
    updatedAt
    createdBy {
      ...userAvatarFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ... on Organization {
        id
      }
    }
  }
`;

export const projectsQuery = gql`
  query projectsQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ProjectFilterInput
    $sortBy: ProjectSortInput
    $isSummary: Boolean = false
  ) {
    projects(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...projectSheetFragment
        ... on Project {
          milestones {
            ...milestoneSheetFragment
            ... on Milestone {
              tasks {
                ...taskSheetFragment
              }
            }
          }
        }
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${projectSheetFragment}
  ${milestoneSheetFragment}
  ${taskSheetFragment}
  ${userAvatarFragment}
  ${documentFragment}
  ${documentSummaryFragment}
  ${tagFragment}
  ${ownedByFragment}
  ${partnerCardFragment}
  ${forbiddenFragment}
`;

export const milestoneByIDQuery = gql`
  query milestoneByIDQuery($id: ID!, $isSummary: Boolean = false) {
    milestone(id: $id) {
      ...milestoneSheetFragment
      ... on Milestone {
        project {
          ... on Project {
            id
          }
        }
        tasks {
          ...taskSheetFragment
        }
      }
    }
  }

  ${milestoneSheetFragment}
  ${taskSheetFragment}
  ${userAvatarFragment}
  ${documentFragment}
  ${documentSummaryFragment}
  ${ownedByFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export const taskByIDQuery = gql`
  query taskByIDQuery($id: ID!) {
    task(id: $id) {
      ...taskSheetFragment
      ... on Task {
        milestone {
          ... on Milestone {
            id
            project {
              ... on Project {
                id
              }
            }
          }
        }
      }
    }
  }

  ${taskSheetFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export const userByIDQuery = gql`
  query userByIDQuery($id: ID!) {
    user(id: $id) {
      ...userAvatarFragment
    }
  }

  ${userAvatarFragment}
`;

export const usersByIDsQuery = gql`
  query usersByIDsQuery($ids: [ID!]!) {
    usersByIDs(ids: $ids) {
      ...userAvatarFragment
    }
  }

  ${userAvatarFragment}
`;

export const tagsByIDsQuery = gql`
  query tagsByIDsQuery($ids: [ID!]!) {
    tagsByIDs(ids: $ids) {
      ...tagFragment
      ...forbiddenFragment
    }
  }

  ${tagFragment}
  ${forbiddenFragment}
`;

export const projectMutation = gql`
  mutation projectMutation($id: ID!, $input: ProjectUpdateInput!) {
    projectUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const milestoneMutation = gql`
  mutation milestoneMutation($id: ID!, $input: MilestoneUpdateInput!) {
    milestoneUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const taskMutation = gql`
  mutation taskMutation($id: ID!, $input: TaskUpdateInput!) {
    taskUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;
