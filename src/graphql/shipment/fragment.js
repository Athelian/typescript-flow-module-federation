// @flow
import gql from 'graphql-tag';
import { isEnableBetaFeature } from 'utils/env';

export const shipmentFormFragment = isEnableBetaFeature
  ? gql`
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
        customFields {
          ...customFieldsFragment
        }
        forwarders {
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
          ...shipmentContainerCardFragment
        }
        totalVolume {
          ...metricFragment
        }
        batches {
          ...batchFormFragment
        }
      }
    `
  : gql`
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
        customFields {
          ...customFieldsFragment
        }
        forwarders {
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
        totalVolume {
          ...metricFragment
        }
        batches {
          ...batchFormFragment
        }
      }
    `;

export const shipmentCardFragment = isEnableBetaFeature
  ? gql`
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
    `
  : gql`
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
        batches {
          ... on Batch {
            id
          }
        }
      }
    `;
