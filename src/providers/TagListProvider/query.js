// @flow
import gql from 'graphql-tag';

export const tagsQuery = gql`
  query tagsQuery($entityTypes: [TagEntityType!], $query: String!, $page: Int!, $perPage: Int!) {
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

export default tagsQuery;
