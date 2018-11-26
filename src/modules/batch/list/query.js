// @flow
import gql from 'graphql-tag';
import {
  batchCardFragment,
  metricFragment,
  orderCardFragment,
  userAvatarFragment,
  tagFragment,
  priceFragment,
  imageFragment,
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

  ${orderCardFragment}
  ${userAvatarFragment}
  ${batchCardFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
`;

export default batchListQuery;
