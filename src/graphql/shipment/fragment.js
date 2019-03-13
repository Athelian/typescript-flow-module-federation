// @flow
import gql from 'graphql-tag';

export const shipmentFormFragment = gql`
  fragment shipmentFormFragment on Shipment {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    memo
    no
    blNo
    blDate
    bookingNo
    bookingDate
    invoiceNo
    incoterm
    loadType
    transportType
    carrier
    ownedBy {
      ...ownedByFragment
    }
    todo {
      tasks {
        ...taskCardFragment
      }
    }
    customFields {
      ...customFieldsFragment
    }
    forwarders {
      ...partnerCardFragment
    }
    importer {
      ...partnerCardFragment
    }
    inCharges {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
    }
    files {
      ...documentFragment
    }
    cargoReady {
      ...timelineDateFullFragment
    }
    voyages {
      ... on Voyage {
        id
        vesselName
        vesselCode
        departurePort {
          ...portFragment
        }
        arrivalPort {
          ...portFragment
        }
        departure {
          ...timelineDateFullFragment
        }
        arrival {
          ...timelineDateFullFragment
        }
      }
    }
    containerGroups {
      ... on ContainerGroup {
        id
        warehouse {
          ... on Warehouse {
            id
            name
            ownedBy {
              ... on Group {
                id
                name
              }
            }
          }
        }
        customClearance {
          ...timelineDateFullFragment
        }
        warehouseArrival {
          ...timelineDateFullFragment
        }
        deliveryReady {
          ...timelineDateFullFragment
        }
      }
    }
    containers {
      ...containerFormFragment
    }
    totalVolume {
      ...metricFragment
    }
    batches {
      ...batchFormFragment
    }
  }
`;

export const shipmentCardFragment = gql`
  fragment shipmentCardFragment on Shipment {
    id
    archived
    no
    blNo
    transportType
    batchCount
    orderItemCount
    totalVolume {
      ...metricFragment
    }
    importer {
      ... on Group {
        id
        name
      }
    }
    cargoReady {
      ...timelineDateMinimalFragment
    }
    tags {
      ...tagFragment
    }
    inCharges {
      ...userAvatarFragment
    }
    voyages {
      ... on Voyage {
        id
        departurePort {
          ...portFragment
        }
        arrivalPort {
          ...portFragment
        }
        departure {
          ...timelineDateMinimalFragment
        }
        arrival {
          ...timelineDateMinimalFragment
        }
      }
    }
    containerGroups {
      ... on ContainerGroup {
        id
        customClearance {
          ...timelineDateMinimalFragment
        }
        warehouseArrival {
          ...timelineDateMinimalFragment
        }
        deliveryReady {
          ...timelineDateMinimalFragment
        }
        warehouse {
          ... on Warehouse {
            id
            name
          }
        }
      }
    }
    containers {
      ... on Container {
        id
        warehouseArrivalAgreedDate
        warehouseArrivalAgreedDateApprovedAt
        warehouseArrivalActualDate
        warehouseArrivalActualDateApprovedAt
        warehouse {
          ... on Warehouse {
            id
            name
          }
        }
      }
    }
    batches {
      ... on Batch {
        id
      }
    }
  }
`;
