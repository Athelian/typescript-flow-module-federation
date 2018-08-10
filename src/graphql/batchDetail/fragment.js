// @flow
import gql from 'graphql-tag';
import { userListFieldsFragment } from '../userList/fragment';

export const detailedBatchItemFragment = gql`
  fragment detailedBatchItem on BatchItem {
    id
    status
    no
    quantity
    realQuantity
    unassignedQuantity
    packageQuantity
    packageName
    packageGrossWeight
    packageVolume
    packageMaxQuantity
    packageSize
    memo
    producedAt
    deliveredAt
    expiredAt
    createdAt
    updatedAt
    orderItem {
      id
      price
      order {
        id
        PO
        currency
        exporter {
          id
        }
      }
      productExporterSupplier {
        id
        inspectionFee
        weight
        volume
        exporter {
          id
          name
        }
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
    tags {
      id
      name
      description
      color
    }
    assignments {
      id
      quantity
      memo
      user {
        ...userListFields
      }
      request {
        id
        client
        quantity
      }
    }
    adjustments {
      id
      type
      quantity
      memo
    }
    shipment {
      id
      no
      currentStatus
      cargoReady
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
  }

  ${userListFieldsFragment}
`;

export default detailedBatchItemFragment;
