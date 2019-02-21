// @flow
import gql from 'graphql-tag';
import {
  timelineDateMinimalFragment,
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

export const ordersByIDsExportQuery = gql`
  query ordersByIDsExport($ids: [ID!]!, $templateId: ID!, $fields: [String!]) {
    ordersByIDsExport(ids: $ids, templateId: $templateId, fields: $fields) {
      ... on File {
        path
      }
    }
  }
`;

const orderTableFragment = gql`
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
const orderItemTableFragment = gql`
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

const batchTableFragment = gql`
  fragment batchTableFragment on Batch {
    id
    no
    quantity
    deliveredAt
    desiredAt
    expiredAt
    producedAt
    totalAdjusted
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
  }
`;

const shipmentTableFragment = gql`
  fragment shipmentTableFragment on Shipment {
    id
    no
    blNo
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
      ...timelineDateMinimalFragment
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
              }
            }
          }
        }
      }
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
  ${timelineDateMinimalFragment}
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

export default ordersByIDsExportQuery;
