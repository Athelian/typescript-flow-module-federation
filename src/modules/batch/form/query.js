// @flow
import gql from 'graphql-tag';

export const batchFragment = gql`
  fragment batchFragment on Batch {
    archived
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
        currency
        exporter {
          id
          name
          types
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
          batches {
            id
            quantity
            batchAdjustments {
              id
              quantity
            }
          }
        }
      }
      productProvider {
        id
        product {
          id
          name
          serial
          files {
            id
            path
          }
        }
        exporter {
          id
          name
          types
        }
        supplier {
          id
          name
          types
        }
      }
    }
    shipment {
      id
    }
    no
    quantity
    packageQuantity
    producedAt
    deliveredAt
    expiredAt
    batchAdjustments {
      reason
      quantity
      memo
      id
      updatedAt
      updatedBy {
        firstName
        lastName
        id
      }
      sort
    }
    id
    updatedAt
    updatedBy {
      firstName
      lastName
      id
    }
    packageName
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
    packageCapacity
    tags {
      name
      color
      id
    }
  }
`;

export const batchDetailQuery = gql`
  query($id: ID!) {
    batch(id: $id) {
      ...batchFragment
    }
  }

  ${batchFragment}
`;

export default batchDetailQuery;
