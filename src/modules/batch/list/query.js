// @flow
import gql from 'graphql-tag';
// import { removeTypename } from 'utils/data';

const userListFragment = gql`
  fragment userListFields on User {
    firstName
    lastName
  }
`;

export const batchItemListFragment = gql`
  fragment batchItemListFields on BatchItem {
    id
    createdAt
    updatedAt
    no
    status
    quantity
    realQuantity
    deliveredAt
    tags {
      id
      name
      color
      description
    }
    adjustments {
      id
      type
      quantity
      memo
    }
    assignments {
      id
      quantity
      user {
        ...userListFields
      }
      memo
    }
    batchGroup {
      id
      no
      taskManagement {
        id
        lastApprovedTask {
          id
          icon
          title
          approvedAt
          approvedBy {
            ...userListFields
          }
        }
      }
    }
    shipment {
      id
      no
    }
    orderItem {
      id
      order {
        id
        PO
        exporter {
          id
          name
        }
      }
      productExporterSupplier {
        id
        product {
          id
          name
          serial
          files {
            path
          }
        }
      }
    }
  }

  ${userListFragment}
`;

export const batchItemListQuery = gql`
  query($filter: BatchItemFilterInput!, $sort: SortInput, $page: Int!, $perPage: Int!) {
    viewer {
      batchItems(filter: $filter, sort: $sort, page: $page, perPage: $perPage) {
        nodes {
          ...batchItemListFields
        }
        page
        totalPage
      }
    }
  }

  ${batchItemListFragment}
`;

export const matchingBatchListQuery = gql`
  query($filter: BatchItemFilterInput!, $sort: SortInput, $page: Int!, $perPage: Int!) {
    viewer {
      batchItems(filter: $filter, sort: $sort, page: $page, perPage: $perPage) {
        nodes {
          id
        }
      }
    }
  }
`;

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

export const parseBatchItemsDataQueryData = (result: Object): Array<Object> =>
  result.data.batchItems;
// removeTypename(result.data.batchItems);

export const applyBatchItemChangeMutation = gql`
  mutation($id: ID!, $input: UpdateBatchItemInput!) {
    updateBatchItem(id: $id, input: $input) {
      quantity
      deliveredAt
      assignments {
        id
        quantity
        user {
          ...userListFields
        }
        memo
      }
    }
  }

  ${userListFragment}
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
