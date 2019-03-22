import gql from 'graphql-tag';

export const containerFormFragment = gql`
  fragment containerFormFragment on Container {
    id
    archived
    updatedAt
    no
    memo
    ownedBy {
      ...ownedByFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    warehouse {
      ...warehouseCardFragment
    }
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedAt
    warehouseArrivalActualDateApprovedAt
    warehouseArrivalAgreedDateApprovedBy {
      ...userAvatarFragment
    }
    warehouseArrivalActualDateApprovedBy {
      ...userAvatarFragment
    }
    warehouseArrivalAgreedDateAssignedTo {
      ...userAvatarFragment
    }
    warehouseArrivalActualDateAssignedTo {
      ...userAvatarFragment
    }
    freeTimeStartDate
    freeTimeDuration
    autoCalculatedFreeTimeStartDate
    yardName
    departureDate
    departureDateAssignedTo {
      ...userAvatarFragment
    }
    departureDateApprovedAt
    departureDateApprovedBy {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
    }
    shipment {
      ...shipmentCardFragment
    }
    batches {
      ...batchFormFragment
    }
    representativeBatch {
      ...batchFormFragment
    }
  }
`;

export const containerCardFragment = gql`
  fragment containerCardFragment on Container {
    id
    no
    representativeBatch {
      ... on Batch {
        id
        orderItem {
          ... on OrderItem {
            id
            productProvider {
              ... on ProductProvider {
                id
                product {
                  ... on Product {
                    id
                    files {
                      ...imageFragment
                    }
                    name
                    serial
                  }
                }
              }
            }
          }
        }
      }
    }
    totalVolume {
      ...metricFragment
    }
    batches {
      ... on Batch {
        id
      }
    }
    warehouse {
      ... on Warehouse {
        id
        name
      }
    }
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedBy {
      ... on User {
        id
      }
    }
    warehouseArrivalActualDateApprovedBy {
      ... on User {
        id
      }
    }
    shipment {
      ... on Shipment {
        id
        no
        importer {
          ... on Group {
            id
            name
          }
        }
      }
    }
    tags {
      ...tagFragment
    }
  }
`;

export const shipmentContainerCardFragment = gql`
  fragment shipmentContainerCardFragment on Container {
    id
    no
    representativeBatch {
      ...batchFormFragment
    }
    totalVolume {
      ...metricFragment
    }
    batches {
      ...batchFormFragment
    }
    warehouse {
      ... on Warehouse {
        id
        name
      }
    }
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedAt
    warehouseArrivalAgreedDateApprovedBy {
      ...userAvatarFragment
    }
    warehouseArrivalActualDateApprovedAt
    warehouseArrivalActualDateApprovedBy {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
    }
  }
`;
