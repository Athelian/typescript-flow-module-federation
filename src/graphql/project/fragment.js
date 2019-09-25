// @flow
import gql from 'graphql-tag';
import { ownedByFragment, tagFragment, userAvatarFragment } from 'graphql/common/fragment';
import { taskCountFragment, taskFormInProjectFragment } from 'graphql/task/fragment';

const milestoneInProjectCardFragment = gql`
  fragment milestoneInProjectCardFragment on Milestone {
    id
    name
    dueDate
    completedAt
    estimatedCompletionDate
    tasks {
      ... on Task {
        id
        completedAt
        skippedAt
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
      ...milestoneInProjectCardFragment
    }
    taskCount {
      ...taskCountFragment
    }
    tags {
      ...tagFragment
    }
  }
  ${milestoneInProjectCardFragment}
  ${taskCountFragment}
  ${tagFragment}
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
  ${taskCountFragment}
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
          ...taskFormInProjectFragment
          ... on Task {
            milestoneSort
          }
        }
      }
    }
  }
  ${ownedByFragment}
  ${tagFragment}
  ${userAvatarFragment}
  ${taskCountFragment}
  ${taskFormInProjectFragment}
`;
