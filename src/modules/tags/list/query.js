import gql from 'graphql-tag';

export const tagsQuery = gql`
  query($entityTypes: [TagEntityType!], $page: Int!, $perPage: Int!) {
    tags(filterBy: { entityTypes: $entityTypes }, page: $page, perPage: $perPage) {
      nodes {
        id
        name
        description
        color
        entityTypes
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
