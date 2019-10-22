// @flow
import gql from 'graphql-tag';

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

export default tagsQuery;
