// @flow
import gql from 'graphql-tag';
import { userListFieldsFragment } from 'graphql/userList/fragment';
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
  ${userListFieldsFragment}
  ${detailedBatchFragment}
`;

export default orderDetailQuery;
