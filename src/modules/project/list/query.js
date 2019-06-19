// @flow
import gql from 'graphql-tag';
import {
  projectCardFragment,
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
        ...projectCardFragment
        ...notFoundFragment
        ...badRequestFragment
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }

  ${projectCardFragment}
  ${tagFragment}
  ${notFoundFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default projectListQuery;
