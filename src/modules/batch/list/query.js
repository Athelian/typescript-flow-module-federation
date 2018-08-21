// @flow
import gql from 'graphql-tag';
import { violationFragment } from '../../../graphql/violations/fragment';
// import { removeTypename } from 'utils/data';

const userListFragment = gql`
  fragment userListFields on User {
    firstName
    lastName
  }
`;

export const batchItemListFragment = gql`
  fragment batchItemListFields on Batch {
    id
    createdAt
    updatedAt
    no
    archived
    quantity
    deliveredAt
    batchAdjustments {
      id
      reason
      quantity
      memo
    }
    batchAssignments {
      id
      quantity
      user {
        ...userListFields
      }
      memo
    }
    orderItem {
      id
      order {
        id
        poNo
        exporter {
          id
          name
        }
      }
      productProvider {
        id
        product {
          id
          name
          serial
        }
      }
    }
  }

  ${userListFragment}
`;

export const batchItemListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    batches(page: $page, perPage: $perPage) {
      nodes {
        ...batchItemListFields
      }
      page
      totalPage
    }
  }

  ${batchItemListFragment}
`;

export const matchingBatchListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    batches(page: $page, perPage: $perPage) {
      nodes {
        id
      }
    }
  }
`;

/*
export const batchItemsDataQuery = gql`
  query($ids: [ID!]!) {
    batchItems(ids: $ids) {
      id
      tags {
        id
        name
        description
        color
      }
    }
  }
`;
*/

export const parseBatchItemsDataQueryData = (result: Object): Array<Object> =>
  result.data.batchItems;
// removeTypename(result.data.batchItems);

export const applyBatchItemChangeMutation = gql`
  mutation($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      batch {
        quantity
        deliveredAt
        batchAssignments {
          id
          quantity
          user {
            ...userListFields
          }
          memo
        }
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${userListFragment}
  ${violationFragment}
`;

type MatchingBatchListData = {
  data: {
    viewer: {
      batchItems: {
        nodes: Array<{ id: string }>,
      },
    },
  },
};

export const parseFetchMatchingQueryData = ({ data }: MatchingBatchListData): Array<string> =>
  data.viewer.batchItems.nodes.map(({ id }) => id);
