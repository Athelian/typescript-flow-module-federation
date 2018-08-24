// @flow
import gql from 'graphql-tag';
import { userListFieldsFragment } from '../userList/fragment';

export const detailedBatchFragment = gql`
  fragment detailedBatchFragment on Batch {
    id
    archived
    no
    quantity
    packageQuantity
    packageName
    packageGrossWeight {
      value
      metric
    }
    packageVolume {
      value
      metric
    }
    packageCapacity
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
    memo
    producedAt
    deliveredAt
    expiredAt
    createdAt
    updatedAt
    orderItem {
      id
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
        }
      }
      productProvider {
        id
        inspectionFee {
          amount
          currency
        }
        unitWeight {
          value
          metric
        }
        unitVolume {
          value
          metric
        }
        exporter {
          id
          name
        }
        product {
          id
          name
          serial
        }
      }
    }
    tags {
      id
      name
      description
      color
    }
    batchAssignments {
      id
      quantity
      memo
      user {
        ...userListFields
      }
    }
    batchAdjustments {
      id
      reason
      quantity
      memo
    }
  }

  ${userListFieldsFragment}
`;

export default detailedBatchFragment;
