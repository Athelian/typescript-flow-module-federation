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
