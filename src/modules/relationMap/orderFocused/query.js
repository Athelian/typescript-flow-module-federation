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
    orderItemCount
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
    customFields {
      ...customFieldsFragment
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
    batches {
      ... on Batch {
        id
      }
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
      ... on ProductProvider {
        id
        unitPrice {
          currency
          amount
        }
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
    order {
      ...orderCardFragment
      ... on Order {
        orderItems {
          ... on OrderItem {
            id
          }
        }
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
        ... on Order {
          orderItems {
            ...orderItemRmFragment
          }
          shipments {
            ...shipmentRMFragment
          }
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
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
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
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${userAvatarFragment}
  ${partnerCardFragment}
  ${timelineDateFullFragment}
  ${tagFragment}
  ${portFragment}
  ${metricFragment}
`;

export default orderListQuery;
