// @flow
import gql from 'graphql-tag';

export const orderFormFragment = gql`
  fragment orderFormFragment on Order {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    memo
    poNo
    currency
    issuedAt
    piNo
    incoterm
    deliveryPlace
    exporter {
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
    orderItems {
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
          files {
            ...imageFragment
          }
        }
        exporter {
          ...partnerNameFragment
        }
        supplier {
          ...partnerNameFragment
        }
      }
      batches {
        ...batchFormFragment
      }
    }
    shipments {
      ...shipmentCardFragment
    }
  }
`;

export const orderCardFragment = gql`
  fragment orderCardFragment on Order {
    id
    archived
    poNo
    issuedAt
    currency
    exporter {
      ...partnerNameFragment
    }
    tags {
      ...tagFragment
    }
    orderItems {
      id
      quantity
      price {
        ...priceFragment
      }
      batches {
        id
        quantity
        batchAdjustments {
          id
          quantity
        }
        shipment {
          id
        }
      }
    }
    inCharges {
      ...userAvatarFragment
    }
  }
`;
