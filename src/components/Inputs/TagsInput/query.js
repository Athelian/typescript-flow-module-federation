// @flow
import gql from 'graphql-tag';
import { tagCardFragment, ownedByFragment } from 'graphql';

export const tagsQuery = gql`
  query tagsQuery($filterBy: TagFilterInput, $page: Int!, $perPage: Int!) {
    tags(filterBy: $filterBy, page: $page, perPage: $perPage) {
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

/**
 * @deprecated use tagsQuery instead
 */
export const tagsForEntityQuery = gql`
  query tagsForEntity(
    $entityOwnerId: ID!
    $entityType: TagEntityType!
    $sortBy: TagSortInput
    $query: String!
    $page: Int!
    $perPage: Int!
  ) {
    tagsForEntity(
      filterBy: { query: $query }
      sortBy: $sortBy
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
