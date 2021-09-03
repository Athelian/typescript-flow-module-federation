// @flow
import gql from 'graphql-tag';

export const tagsQuery = gql`
  query tagsQuery(
    $entityTypes: [TagEntityType!]
    $sortBy: TagSortInput
    $query: String
    $page: Int!
    $perPage: Int!
  ) {
    tags(
      filterBy: { entityTypes: $entityTypes, query: $query }
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

export const tagsForEntityQuery = gql`
  query tagsForEntity(
    $entityOwnerId: ID!
    $entityType: TagEntityType!
    $query: String!
    # $sortBy: TagSortInput
    $page: Int!
    $perPage: Int!
  ) {
    tagsForEntity(
      filterBy: { query: $query }
      entityOwnerId: $entityOwnerId
      entityType: $entityType
      # sortBy: $sortBy
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
