// @flow
import gql from 'graphql-tag';
import {
  batchCardFragment,
  metricFragment,
  tagFragment,
  priceFragment,
  filesFragment,
  partnerNameFragment,
} from 'graphql';

export const batchListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: BatchFilterInput, $sort: BatchSortInput) {
    batches(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...batchCardFragment
      }
      page
      totalPage
    }
  }

  ${batchCardFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${filesFragment}
  ${partnerNameFragment}
`;

export default batchListQuery;
