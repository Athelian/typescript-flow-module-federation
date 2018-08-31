// @flow
import gql from 'graphql-tag';

export const batchDetailQuery = gql`
  query($id: ID!) {
    batch(id: $id) {
      id
      archived
      updatedAt
      updatedBy {
        ...userListFieldsFragment
      }
      no
      quantity
      producedAt
      deliveredAt
      expiredAt
      packageName
      packageQuantity
      packageCapacity
      packageGrossWeight {
        value
        metric
      }
      packageVolume {
        value
        metric
      }
      packageSize {
        length {
          value
          metric
        }
        width {
          value
          metric
        }
        height {
          value
          metric
        }
      }
      orderItem {
        id
        quantity
        price {
          amount
          currency
        }
        order {
          id
          poNo
        }
        productProvider {
          id
          product {
            id
            name
            serial
          }
          exporter {
            id
            name
          }
          supplier {
            id
            name
          }
        }
      }
      tags {
        id
        name
        color
      }
      batchAdjustments {
        id
        sort
        updatedAt
        updatedBy {
          ...userListFieldsFragment
        }
        reason
        quantity
        memo
      }
    }
  }
`;

export default batchDetailQuery;
