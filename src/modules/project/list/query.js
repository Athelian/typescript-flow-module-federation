// @flow
import gql from 'graphql-tag';
import {
  milestoneFragment,
  projectCardFragment,
  taskCountFragment,
  tagFragment,
  notFoundFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';

export const projectListQuery = gql`
  query projectListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ProjectFilterInput
    $sortBy: ProjectSortInput
  ) {
    projects(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Project {
          ...projectCardFragment
          timeline {
            ... on Timeline {
              unreadCount
            }
          }
        }

        ...notFoundFragment
        ...badRequestFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }
  ${milestoneFragment}
  ${projectCardFragment}
  ${taskCountFragment}
  ${tagFragment}
  ${notFoundFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default projectListQuery;
