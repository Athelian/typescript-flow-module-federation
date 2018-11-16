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
  portFragment,
} from 'graphql';

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
  ${batchFormFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
`;

export default orderListQuery;
