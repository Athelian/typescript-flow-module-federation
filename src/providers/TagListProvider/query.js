// @flow
import gql from 'graphql-tag';

export const tagsQuery = gql`
  query tagsQuery($entityTypes: [TagEntityType!], $query: String, $page: Int!, $perPage: Int!) {
    tags(filterBy: { entityTypes: $entityTypes, query: $query }, page: $page, perPage: $perPage) {
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
    $page: Int!
    $perPage: Int!
  ) {
    tagsForEntity(
      entityOwnerId: $entityOwnerId
      entityType: $entityType
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
