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
    customFields {
      ...customFieldsFragment
    }
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

export const orderBasicFragment = gql`
  fragment orderBasicFragment on Order {
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
    customFields {
      ...customFieldsFragment
    }
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
  }
`;
export const orderFragmentForRM = gql`
  fragment orderFragmentForRM on Order {
    ...orderBasicFragment
    shipments {
      ...shipmentFormFragment
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
