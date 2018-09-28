// @flow
import gql from 'graphql-tag';
import { detailedBatchFragment } from 'graphql/batchDetail/fragment';

export const batchListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: BatchFilterInput, $sort: BatchSortInput) {
    batches(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...detailedBatchFragment
      }
      page
      totalPage
    }
  }

  ${detailedBatchFragment}
`;

export default batchListQuery;
