// @flow
import gql from 'graphql-tag';
import { userListFieldsFragment } from 'graphql/userList/fragment';
import { PESListFieldsFragment } from 'graphql/pesList/fragment';
import { detailedBatchItemFragment } from 'graphql/batchDetail/fragment';

export const orderDetailQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      id
      status
      PO
      date
      PI
      incoterms
      deliveryPlace
      currency
      totalPrice
      memo
      batchedQuantity
      shippedQuantity
      createdAt
      updatedAt
      items {
        id
        quantity
        price
        totalPrice
        batchedQuantity
        shippedQuantity
        productExporterSupplier {
          ...PESListFields
        }
        batchItems {
          ...detailedBatchItem
        }
      }
      files {
        id
        path
        memo
        type
      }
      exporter {
        id
        name
      }
      timeline {
        __typename
        ... on Comment {
          id
          body
          user {
            ...userListFields
          }
          createdAt
          updatedAt
        }

        ... on Event {
          id
          type
          target {
            __typename
            ... on BatchItem {
              no
            }
            ... on OrderItem {
              productExporterSupplier {
                id
                product {
                  id
                  name
                }
              }
            }
            ... on Entity {
              id
            }
          }
          changes {
            field
            oldValue
            newValue
          }
          user {
            ...userListFields
          }
          createdAt
          updatedAt
        }
      }
    }
  }

  ${PESListFieldsFragment}
  ${userListFieldsFragment}
  ${detailedBatchItemFragment}
`;

export default orderDetailQuery;
