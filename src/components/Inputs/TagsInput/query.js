// @flow
import gql from 'graphql-tag';
import { tagCardFragment, ownedByFragment } from 'graphql';

export const tagsQuery = gql`
  query tagsQuery($entityType: TagEntityType!, $query: String, $page: Int!, $perPage: Int!) {
    tags(filterBy: { query: $query, entityTypes: [$entityType] }, page: $page, perPage: $perPage) {
      nodes {
        ... on Tag {
          id
          name
          color
        }
      }
      page
      totalPage
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
        ...tagCardFragment
        ... on Tag {
          ownedBy {
            ...ownedByFragment
          }
        }
      }
      page
      totalPage
      perPage
      count
      totalCount
    }
  }

  ${tagCardFragment}
  ${ownedByFragment}
`;

export default tagsQuery;
