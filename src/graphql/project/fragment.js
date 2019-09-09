// @flow
import gql from 'graphql-tag';

export const milestoneFragment = gql`
  fragment milestoneFragment on Milestone {
    id
    name
    dueDate
    completedAt
    tasks {
      ... on Task {
        id
        completedAt
      }
    }
  }
`;

export const projectCardFragment = gql`
  fragment projectCardFragment on Project {
    id
    name
    description
    dueDate
    milestones {
      ...milestoneFragment
    }
    taskCount {
      ...taskCountFragment
    }
    tags {
      ...tagFragment
    }
  }
`;

export const milestoneCardFragment = gql`
  fragment milestoneCardFragment on Milestone {
    id
    name
    description
    dueDate
    taskCount {
      ...taskCountFragment
    }
  }
`;

export const projectFormQueryFragment = gql`
  fragment projectFormQueryFragment on Project {
    id
    name
    description
    dueDate
    taskCount {
      ...taskCountFragment
    }
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    tags {
      ...tagFragment
    }
    milestones {
      ... on Milestone {
        id
        updatedAt
        updatedBy {
          ...userAvatarFragment
        }

        name
        dueDate
        dueDateInterval {
          months
          weeks
          days
        }
        dueDateBinding
        estimatedCompletionDate
        estimatedCompletionDateInterval {
          months
          weeks
          days
        }
        estimatedCompletionDateBinding
        completedAt
        completedBy {
          ...userAvatarFragment
        }
        taskCount {
          ...taskCountFragment
        }
        tasks {
          ...taskWithParentInfoFragment
          ... on Task {
            milestoneSort
          }
        }
      }
    }
  }
`;

export const projectFormFragment = gql`
  fragment projectFormFragment on Project {
    id
    name
    description
    dueDate
    taskCount {
      ...taskCountFragment
    }
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    tags {
      ...tagFragment
    }
  }
`;

export const milestoneFormFragment = gql`
  fragment milestoneFormFragment on Milestone {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }

    name
    description
    dueDate
    completedAt
    completedBy {
      ...userAvatarFragment
    }
  }
`;
