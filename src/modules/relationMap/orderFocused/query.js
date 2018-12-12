import gql from 'graphql-tag';
import {
  sizeFragment,
  metricFragment,
  batchCardFragment,
  tagFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  orderCardFragment,
  orderBasicFragment,
  userAvatarFragment,
  documentFragment,
  batchFormFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  timelineDateFullFragment,
  portFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
} from 'graphql';

export const shipmentRMFragment = gql`
  fragment shipmentRMFragment on Shipment {
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
    totalVolume {
      ...metricFragment
    }
    batchCount
    orderCount
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
    containerGroups {
      id
      warehouse {
        id
        name
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
    batches {
      id
    }
  }
`;

export const orderItemRmFragment = gql`
  fragment orderItemRmFragment on OrderItem {
    id
    quantity
    price {
      ...priceFragment
    }
    productProvider {
      id
      unitPrice {
        currency
        amount
      }
      product {
        id
        name
        serial
      }
      exporter {
        ...partnerNameFragment
      }
      supplier {
        ...partnerNameFragment
      }
    }
    order {
      ...orderCardFragment
      orderItems {
        id
      }
    }
    batches {
      ...batchCardFragment
    }
  }
`;

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderBasicFragment
        orderItems {
          ...orderItemRmFragment
        }
        shipments {
          ...shipmentRMFragment
        }
      }
      page
      totalPage
    }
  }
  ${orderBasicFragment}
  ${userAvatarFragment}
  ${sizeFragment}
  ${metricFragment}
  ${batchCardFragment}
  ${tagFragment}
  ${priceFragment}
  ${portFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${documentFragment}
  ${orderCardFragment}
  ${orderItemRmFragment}
  ${shipmentRMFragment}
  ${batchFormFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${timelineDateFullFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const shipmentRMCardQuery = gql`
  query($id: ID!) {
    shipment(id: $id) {
      ...shipmentRMFragment
    }
  }

  ${shipmentRMFragment}
  ${timelineDateFullFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${tagFragment}
  ${portFragment}
  ${partnerCardFragment}
`;

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: ShipmentFilterInput, $sort: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        ...shipmentRMFragment
      }
      page
      totalPage
    }
  }
  ${shipmentRMFragment}
  ${userAvatarFragment}
  ${partnerCardFragment}
  ${partnerNameFragment}
  ${timelineDateFullFragment}
  ${batchCardFragment}
  ${tagFragment}
  ${portFragment}
  ${metricFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
`;

export default orderListQuery;
