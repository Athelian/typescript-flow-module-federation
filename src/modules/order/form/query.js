// @flow
import gql from 'graphql-tag';
import { productProviderListFragment } from 'graphql/productProviderList/fragment';
import { detailedBatchFragment } from 'graphql/batchDetail/fragment';

export const orderDetailQuery = gql`
  query($id: ID!) {
    order(id: $id) {
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
      }
      exporter {
        id
        name
      }
    }
  }

  ${productProviderListFragment}
  ${detailedBatchFragment}
`;

export default orderDetailQuery;
