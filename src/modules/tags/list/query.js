import gql from 'graphql-tag';
import { tagCardFragment } from 'graphql';

export const tagsQuery = gql`
  query($entityTypes: [TagEntityType!], $page: Int!, $perPage: Int!) {
    tags(filterBy: { entityTypes: $entityTypes }, page: $page, perPage: $perPage) {
      nodes {
        ...tagCardFragment
      }
      page
      totalPage
      perPage
      count
      totalCount
    }
  }

  ${tagCardFragment}
`;

export default tagsQuery;
