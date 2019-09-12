// @flow
import gql from 'graphql-tag';
import {
  taskCardFragment,
  userAvatarFragment,
  tagFragment,
  notFoundFragment,
  badRequestFragment,
  forbiddenFragment,
} from 'graphql';

export const taskListQuery = gql`
  query taskListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: TaskFilterInput
    $sortBy: TaskSortInput
  ) {
    tasks(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Task {
          ...taskCardFragment
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

  ${notFoundFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
  ${taskCardFragment}
  ${userAvatarFragment}
  ${tagFragment}
`;

export default taskListQuery;
