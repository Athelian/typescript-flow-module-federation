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
    inCharges {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
    }
    orderItems {
      ...orderItemTableFragmemt
    }
    shipments {
      ...shipmentTableFramgent
    }
  }
`;
const orderItemTableFragmemt = gql`
  fragment orderItemTableFragmemt on OrderItem {
    id
    quantity
    price {
      ...priceFragment
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
    expiredAt
    producedAt
    totalAdjusted
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

const shipmentTableFramgent = gql`
  fragment shipmentTableFramgent on Shipment {
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
export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderTableFragment
      }
      page
      totalPage
    }
  }
  ${orderTableFragment}
  ${orderItemTableFragmemt}
  ${batchTableFragment}
  ${shipmentTableFramgent}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${sizeFragment}
`;

export default ordersByIDsExportQuery;
