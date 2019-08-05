// @flow
import gql from 'graphql-tag';

export const shipmentFormQueryFragment = gql`
  fragment shipmentFormQueryFragment on Shipment {
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
    booked
    bookingNo
    bookingDate
    invoiceNo
    contractNo
    incoterm
    loadType
    transportType
    carrier
    ownedBy {
      ...ownedByFragment
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
    exporter {
      ...partnerCardFragment
    }
    inCharges {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
    }
    totalVolume {
      ...metricFragment
    }
  }
`;

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
    booked
    bookingNo
    bookingDate
    invoiceNo
    contractNo
    incoterm
    loadType
    transportType
    carrier
    ownedBy {
      ...ownedByFragment
    }
    todo {
      milestone {
        ... on Milestone {
          ...milestoneCardFragment
          project {
            ...projectCardFragment
          }
        }
      }
      tasks {
        ...taskWithoutParentInfoFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
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
    exporter {
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
              ... on Organization {
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
    booked
    transportType
    batchCount
    totalPackageQuantity
    orderItemCount
    totalVolume {
      ...metricFragment
    }
    containerTypeCounts {
      containerType
      count
    }
    importer {
      ...partnerNameFragment
    }
    exporter {
      ...partnerNameFragment
    }
    cargoReady {
      ...timelineDateMinimalFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
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
        vesselName
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
        no
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
        orderItem {
          ... on OrderItem {
            id
            productProvider {
              ... on ProductProvider {
                id
                exporter {
                  ... on Organization {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const shipmentCardWithOwnedFragment = gql`
  fragment shipmentCardWithOwnedFragment on Shipment {
    ...shipmentCardFragment
    ownedBy {
      ...ownedByFragment
    }
  }
`;
