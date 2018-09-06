// @flow
import gql from 'graphql-tag';
import {
  BatchFragment,
  OrderItemNoNestingFragment,
  UserNoNestingFragment,
  GroupNoNestingFragment,
  MetricValueNoNestingFragment,
  ShipmentNoNestingFragment,
} from 'generated/fragments';

const SizeNoNestingFragment = `fragment SizeNoNesting on Size {
  length {
    ...MetricValueNoNesting
  }
  width {
    ...MetricValueNoNesting
  }
  height {
    ...MetricValueNoNesting
  }
}`;

export const batchListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    batches(page: $page, perPage: $perPage) {
      nodes {
        ...Batch
      }
      page
      totalPage
    }
  }

  ${BatchFragment}
  ${OrderItemNoNestingFragment}
  ${UserNoNestingFragment}
  ${GroupNoNestingFragment}
  ${MetricValueNoNestingFragment}
  ${SizeNoNestingFragment}
  ${ShipmentNoNestingFragment}
`;

export default batchListQuery;
