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
  forbiddenFragment,
} from 'graphql';

export const orderEntityFragment = gql`
  fragment orderEntityFragment on Order {
    id
    archived
    poNo
    piNo
    issuedAt
    deliveryDate
    importer {
      ...partnerCardFragment
    }
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
    archived
    quantity
    price {
      ...priceFragment
    }
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
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
    archived
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
    archived
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
    archived
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
    importer {
      ...partnerCardFragment
    }
    mainExporter: exporter {
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
    archived
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
    shipment {
      ... on Shipment {
        id
      }
    }
  }
`;

export const orderShipmentTableQuery = gql`
  query orderShipmentTableQuery($entities: [EntityInput!]!) {
    orderShipmentTable(entities: $entities) {
      ...forbiddenFragment
      ... on Order {
        ...orderEntityFragment
      }
      ... on OrderItem {
        ...orderItemEntityFragment
        order {
          ... on Order {
            id
          }
        }
      }
      ... on Batch {
        ...batchEntityFragment
        orderItem {
          ... on OrderItem {
            id
          }
        }
        container {
          ...containerEntityFragment
        }
        mainShipment: shipment {
          ... on Shipment {
            id
          }
        }
      }
      ... on Shipment {
        ...shipmentEntityFragment
      }
      ... on Container {
        ...containerEntityFragment
        shipment {
          ... on Shipment {
            id
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
  ${forbiddenFragment}
`;

export const editTableViewQuery = gql`
  query editTableViewQuery($orderIds: [ID!]!, $shipmentIds: [ID!]!) {
    ordersByIDs(ids: $orderIds) {
      ...forbiddenFragment
      ... on Order {
        ...orderEntityFragment
        orderItems {
          ...forbiddenFragment
          ... on OrderItem {
            ...orderItemEntityFragment
            batches {
              ...forbiddenFragment
              ... on Batch {
                ...batchEntityFragment
                container {
                  ...containerEntityFragment
                  ...forbiddenFragment
                  ... on Container {
                    batches {
                      ...forbiddenFragment
                      ... on Batch {
                        id
                      }
                    }
                  }
                }
                orderItem {
                  ...forbiddenFragment
                  ... on OrderItem {
                    id
                    order {
                      ...forbiddenFragment
                      ... on Order {
                        id
                      }
                    }
                  }
                }
                shipment {
                  ...forbiddenFragment
                  ... on Shipment {
                    id
                  }
                }
              }
            }
            order {
              ...forbiddenFragment
              ... on Order {
                id
              }
            }
          }
        }
        shipments {
          ...forbiddenFragment
          ...shipmentEntityFragment
        }
      }
    }
    shipmentsByIDs(ids: $shipmentIds) {
      ...forbiddenFragment
      ... on Shipment {
        ...shipmentEntityFragment
        containers {
          ...containerEntityFragment
          ...forbiddenFragment
          ... on Container {
            batches {
              ...forbiddenFragment
              ... on Batch {
                id
              }
            }
          }
        }
        batches {
          ...forbiddenFragment
          ... on Batch {
            ...batchEntityFragment
            container {
              ...forbiddenFragment
              ... on Container {
                id
              }
            }
            orderItem {
              ...forbiddenFragment
              ... on OrderItem {
                ...orderItemEntityFragment
                order {
                  ...orderEntityFragment
                  ...forbiddenFragment
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
  ${forbiddenFragment}
`;
