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
  orderFormFragment,
  orderCardFragment,
  userAvatarFragment,
  documentFragment,
  batchFormFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  timelineDateFullFragment,
  portFragment,
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
        ...orderFormFragment
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
  ${orderFormFragment}
  ${orderCardFragment}
  ${orderItemRmFragment}
  ${shipmentRMFragment}
  ${batchFormFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${timelineDateFullFragment}
`;

export default orderListQuery;
