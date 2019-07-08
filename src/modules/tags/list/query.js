import gql from 'graphql-tag';
import { tagCardFragment } from 'graphql';

export const tagsQuery = gql`
  query($entityTypes: [TagEntityType!], $page: Int!, $perPage: Int!, $sortBy: TagSortInput) {
    tags(page: $page, perPage: $perPage, filterBy: { entityTypes: $entityTypes }, sortBy: $sortBy) {
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
