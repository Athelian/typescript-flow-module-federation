// @flow
import gql from 'graphql-tag';
import {
  timelineDateFullFragment,
  tagFragment,
  portFragment,
  userAvatarFragment,
  metricFragment,
  partnerNameFragment,
  priceFragment,
  sizeFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
} from 'graphql';

export const orderTableFragment = gql`
  fragment orderTableFragment on Order {
    id
    poNo
    piNo
    issuedAt
    exporter {
      ...partnerNameFragment
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
    orderItems {
      ...orderItemTableFragment
    }
    shipments {
      ...shipmentTableFragment
    }
  }
`;
export const orderItemTableFragment = gql`
  fragment orderItemTableFragment on OrderItem {
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
          ... on Product {
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
        }
        exporter {
          ...partnerNameFragment
        }
        supplier {
          ...partnerNameFragment
        }
      }
    }
    batches {
      ...batchTableFragment
    }
  }
`;

export const batchTableFragment = gql`
  fragment batchTableFragment on Batch {
    id
    no
    quantity
    deliveredAt
    desiredAt
    expiredAt
    producedAt
    totalAdjusted
    batchAdjustments {
      ... on BatchAdjustment {
        id
        reason
        quantity
        memo
      }
    }
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
    }
    packageName
    packageQuantity
    packageGrossWeight {
      ...metricFragment
    }
    packageVolume {
      ...metricFragment
    }
    packageSize {
      ...sizeFragment
    }
    shipment {
      ... on Shipment {
        id
      }
    }
  }
`;

export const shipmentTableFragment = gql`
  fragment shipmentTableFragment on Shipment {
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
      ...partnerNameFragment
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

export const findIdsQuery = gql`
  query($orderIds: [ID!]!, $orderItemIds: [ID!]!, $batchIds: [ID!]!, $shipmentIds: [ID!]!) {
    ordersByIDs(ids: $orderIds) {
      ... on Order {
        id
        orderItems {
          ... on OrderItem {
            id
            batches {
              ... on Batch {
                id
                shipment {
                  ... on Shipment {
                    id
                  }
                }
              }
            }
            productProvider {
              ... on ProductProvider {
                id
                product {
                  ... on Product {
                    id
                  }
                }
              }
            }
          }
        }
        shipments {
          ... on Shipment {
            id
          }
        }
      }
    }
    orderItemsByIDs(ids: $orderItemIds) {
      ... on OrderItem {
        id
        batches {
          ... on Batch {
            id
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
        productProvider {
          ... on ProductProvider {
            id
            product {
              ... on Product {
                id
              }
            }
          }
        }
      }
    }
    batchesByIDs(ids: $batchIds) {
      ... on Batch {
        id
        shipment {
          ... on Shipment {
            id
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
            productProvider {
              ... on ProductProvider {
                id
                product {
                  ... on Product {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
    shipmentsByIDs(ids: $shipmentIds) {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
            orderItem {
              ... on OrderItem {
                id
                order {
                  ... on Order {
                    id
                  }
                }
                productProvider {
                  ... on ProductProvider {
                    id
                    product {
                      ... on Product {
                        id
                      }
                    }
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

export const productTableFragment = gql`
  fragment productTableFragment on Product {
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

export const editTableViewQuery = gql`
  query($orderIds: [ID!]!, $shipmentIds: [ID!]!) {
    ordersByIDs(ids: $orderIds) {
      ...orderTableFragment
    }
    shipmentsByIDs(ids: $shipmentIds) {
      ...shipmentTableFragment
    }
  }
  ${orderTableFragment}
  ${orderItemTableFragment}
  ${batchTableFragment}
  ${shipmentTableFragment}
  ${timelineDateFullFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${sizeFragment}
  ${customFieldsFragment}
  ${fieldValuesFragment}
  ${maskFragment}
  ${fieldDefinitionFragment}
`;
