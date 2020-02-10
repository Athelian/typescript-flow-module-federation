import gql from 'graphql-tag';
import { documentFragment, ownedByFragment, forbiddenFragment } from 'graphql';

export const documentListQuery = gql`
  query documentListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: FileFilterInput
    $sortBy: FileSortInput
  ) {
    files(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...documentFragment
        ... on File {
          orphan
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
