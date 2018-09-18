// @flow
import gql from 'graphql-tag';
import { productProviderListFragment } from 'graphql/productProviderList/fragment';
import { detailedBatchFragment } from 'graphql/batchDetail/fragment';

export const orderDetailFragment = gql`
  fragment orderDetailFragment on Order {
    id
    archived
    poNo
    issuedAt
    piNo
    incoterm
    deliveryPlace
    currency
    memo
    createdAt
    updatedAt
    updatedBy {
      firstName
      lastName
    }
    tags {
      id
      name
      color
    }
    orderItems {
      id
      quantity
      price {
        amount
        currency
      }
      productProvider {
        ...productProviderListFragment
      }
      batches {
        ...detailedBatchFragment
      }
      shipments {
        id
      }
    }
    files {
      id
      name
      path
      type
      memo
    }
    exporter {
      id
      name
    }
  }

  ${productProviderListFragment}
  ${detailedBatchFragment}
`;

export const orderDetailQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      ...orderDetailFragment
    }
  }

  ${orderDetailFragment}
`;

export default orderDetailQuery;
