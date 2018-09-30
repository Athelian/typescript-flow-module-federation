// @flow
import gql from 'graphql-tag';
import { userListFieldsFragment } from '../userList/fragment';

export const detailedBatchFragment = gql`
  fragment detailedBatchFragment on Batch {
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
        currency
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
    shipment {
      id
      blNo
      no
      containerGroups {
        warehouseArrival {
          date
        }
      }
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

  ${userListFieldsFragment}
`;

export default detailedBatchFragment;
