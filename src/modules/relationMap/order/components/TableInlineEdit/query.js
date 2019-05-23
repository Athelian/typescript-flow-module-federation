// @flow
import gql from 'graphql-tag';
import {
  timelineDateFullFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  partnerCardFragment,
  priceFragment,
  sizeFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
} from 'graphql';

export const orderEntityFragment = gql`
  fragment orderEntityFragment on Order {
    id
    poNo
    piNo
    issuedAt
    exporter {
      ...partnerCardFragment
    }
    currency
    incoterm
    deliveryPlace
    customFields {
      ...customFieldsFragment
    }
    inCharges {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
    }
  }
`;

export const orderItemEntityFragment = gql`
  fragment orderItemEntityFragment on OrderItem {
    id
    quantity
    price {
      ...priceFragment
    }
    customFields {
      ...customFieldsFragment
    }
    productProvider {
      ... on ProductProvider {
        id
        product {
          ...productEntityFragment
        }
        exporter {
          ...partnerCardFragment
        }
        supplier {
          ...partnerCardFragment
        }
      }
    }
  }
`;

export const productEntityFragment = gql`
  fragment productEntityFragment on Product {
    id
    name
    serial
    janCode
    hsCode
    material
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
    }
  }
`;

export const batchEntityFragment = gql`
  fragment batchEntityFragment on Batch {
    id
    no
    quantity
    deliveredAt
    desiredAt
    expiredAt
    producedAt
    latestQuantity
    batchQuantityRevisions {
      ... on BatchQuantityRevision {
        id
        quantity
        type
      }
    }
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
    }
    packageName
    packageCapacity
    packageQuantity
    autoCalculatePackageQuantity
    packageGrossWeight {
      ...metricFragment
    }
    packageVolume {
      ...metricFragment
    }
    packageSize {
      ...sizeFragment
    }
  }
`;

export const shipmentEntityFragment = gql`
  fragment shipmentEntityFragment on Shipment {
    id
    no
    blNo
    blDate
    transportType
    totalVolume {
      ...metricFragment
    }
    bookingNo
    bookingDate
    invoiceNo
    loadType
    incoterm
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
    cargoReady {
      ...timelineDateFullFragment
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
        customClearance {
          ...timelineDateFullFragment
        }
        warehouseArrival {
          ...timelineDateFullFragment
        }
        deliveryReady {
          ...timelineDateFullFragment
        }
        warehouse {
          ... on Warehouse {
            id
            name
          }
        }
      }
    }
  }
`;
export const containerEntityFragment = gql`
  fragment containerEntityFragment on Container {
    id
    no
    warehouse {
      ... on Warehouse {
        id
        name
      }
    }
    containerType
    containerOption
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
    tags {
      ...tagFragment
    }
  }
`;

export const editTableViewQuery = gql`
  query ordersAndShipments($orderIds: [ID!]!, $shipmentIds: [ID!]!) {
    ordersByIDs(ids: $orderIds) {
      ... on Order {
        ...orderEntityFragment
        orderItems {
          ... on OrderItem {
            ...orderItemEntityFragment
            batches {
              ... on Batch {
                ...batchEntityFragment
                container {
                  ...containerEntityFragment
                  ... on Container {
                    batches {
                      ... on Batch {
                        id
                      }
                    }
                  }
                }
                orderItem {
                  ... on OrderItem {
                    id
                    order {
                      ... on Order {
                        id
                      }
                    }
                  }
                }
                shipment {
                  ... on Shipment {
                    id
                  }
                }
              }
            }
            order {
              ... on Order {
                id
              }
            }
          }
        }
        shipments {
          ...shipmentEntityFragment
        }
      }
    }
    shipmentsByIDs(ids: $shipmentIds) {
      ... on Shipment {
        ...shipmentEntityFragment
        containers {
          ...containerEntityFragment
          ... on Container {
            batches {
              ... on Batch {
                id
              }
            }
          }
        }
        batches {
          ... on Batch {
            ...batchEntityFragment
            container {
              ... on Container {
                id
              }
            }
            orderItem {
              ... on OrderItem {
                ...orderItemEntityFragment
                order {
                  ...orderEntityFragment
                }
              }
            }
          }
        }
      }
    }
  }
  ${orderEntityFragment}
  ${orderItemEntityFragment}
  ${batchEntityFragment}
  ${shipmentEntityFragment}
  ${containerEntityFragment}
  ${productEntityFragment}
  ${timelineDateFullFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${partnerCardFragment}
  ${priceFragment}
  ${sizeFragment}
  ${customFieldsFragment}
  ${fieldValuesFragment}
  ${maskFragment}
  ${fieldDefinitionFragment}
`;
