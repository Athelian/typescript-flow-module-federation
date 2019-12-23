import gql from 'graphql-tag';
import { documentFragment, ownedByFragment, forbiddenFragment } from 'graphql';

export const documentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: FileFilterInput, $sortBy: FileSortInput) {
    files(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...documentFragment
        ... on File {
          ownedBy {
            ...ownedByFragment
          }
        }
        ...forbiddenFragment
      }
      page
      totalPage
    }
  }
  ${ownedByFragment}
  ${documentFragment}
  ${forbiddenFragment}
`;

export default documentListQuery;
