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
        avatar
        id
      }
      sort
    }
    id
    updatedAt
    updatedBy {
      firstName
      lastName
      avatar
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
