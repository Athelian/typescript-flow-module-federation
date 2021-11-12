// @flow
import gql from 'graphql-tag';

export const tagsQuery = gql`
  query tagsQuery($filterBy: TagFilterInput, $sortBy: TagSortInput, $page: Int!, $perPage: Int!) {
    tags(filterBy: $filterBy, sortBy: $sortBy, page: $page, perPage: $perPage) {
      nodes {
        ... on Tag {
          id
          name
          color
        }
      }
      page
      totalPage
      perPage
      count
      totalCount
    }
  }
`;

/**
 * @deprecated use tagsQuery instead
 */
export const tagsForEntityQuery = gql`
  query tagsForEntity(
    $entityOwnerId: ID!
    $entityType: TagEntityType!
    $query: String!
    $sortBy: TagSortInput
    $page: Int!
    $perPage: Int!
  ) {
    tagsForEntity(
      filterBy: { query: $query }
      entityOwnerId: $entityOwnerId
      entityType: $entityType
      sortBy: $sortBy
      page: $page
      perPage: $perPage
    ) {
      nodes {
        ... on Tag {
          id
          name
          color
        }
      }
      page
      totalPage
      perPage
      count
      totalCount
    }
  }
`;

export default tagsQuery;
