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
    followers {
      ...userAvatarFragment
    }
    ... on Followed {
      notificationUnseenCount
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
    totalPackageQuantityOverride
    totalPackageQuantityOverriding
    totalVolumeOverride {
      ...metricFragment
    }
    totalVolumeOverriding
    totalWeightOverride {
      ...metricFragment
    }
    totalWeightOverriding
    ownedBy {
      ...ownedByFragment
    }
    customFields {
      ...customFieldsFragment
    }
    forwarders {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    importer {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    exporter {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
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
    followers {
      ...userAvatarFragment
    }
    ... on Followed {
      notificationUnseenCount
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
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    importer {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    exporter {
      ... on Organization {
        id
        name
        types
        partner {
          ...partnerCardFragment
        }
      }
    }
    totalPackageQuantityOverride
    totalPackageQuantityOverriding
    totalVolumeOverride {
      ...metricFragment
    }
    totalVolumeOverriding
    totalWeightOverride {
      ...metricFragment
    }
    totalWeightOverriding
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
    ... on Followed {
      notificationUnseenCount
    }
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
        freeTimeStartDate
        freeTimeDuration
        containerType
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
    ownedBy {
      ...ownedByFragment
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
