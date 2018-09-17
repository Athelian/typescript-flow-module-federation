// @flow
import gql from 'graphql-tag';
import { detailedBatchFragment } from 'graphql/batchDetail/fragment';

export const batchListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    batches(page: $page, perPage: $perPage) {
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
