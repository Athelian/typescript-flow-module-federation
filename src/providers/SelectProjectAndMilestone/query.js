// @flow
import gql from 'graphql-tag';
import {
  taskCountFragment,
  milestoneFragment,
  projectCardNewFragment,
  milestoneCardFragment,
  tagFragment,
  notFoundFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';

export const selectProjectQuery = gql`
  query selectProjectQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ProjectFilterInput
    $sortBy: ProjectSortInput
  ) {
    projects(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...projectCardNewFragment
        ... on Project {
          milestones {
            ...milestoneCardFragment
            ...notFoundFragment
            ...badRequestFragment
            ...forbiddenFragment
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
  ${projectCardNewFragment}
  ${taskCountFragment}
  ${milestoneCardFragment}
  ${tagFragment}
  ${notFoundFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default selectProjectQuery;
