// @flow
import gql from 'graphql-tag';
import {
  badRequestFragment,
  forbiddenFragment,
  userAvatarFragment,
  documentFragment,
  tagFragment,
  ownedByFragment,
} from 'graphql';

const projectSheetFragment = gql`
  fragment projectSheetFragment on Project {
    id
    name
    description
    dueDate
    tags {
      ...tagFragment
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

const milestoneSheetFragment = gql`
  fragment milestoneSheetFragment on Milestone {
    id
    name
    description
    dueDate
    dueDateBinding
    dueDateInterval {
      days
    }
    estimatedCompletionDate
    estimatedCompletionDateBinding
    estimatedCompletionDateInterval {
      days
    }
    completedAt
    completedBy {
      ...userAvatarFragment
    }
    files {
      ...documentFragment
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
      ... on Model {
        id
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
    assignedTo {
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
  ${tagFragment}
  ${ownedByFragment}
  ${forbiddenFragment}
`;

export const milestoneByIDQuery = gql`
  query milestoneByIDQuery($id: ID!) {
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
  ${documentFragment}
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
    }
  }

  ${tagFragment}
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
