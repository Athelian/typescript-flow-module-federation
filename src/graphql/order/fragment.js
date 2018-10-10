// @flow
import gql from 'graphql-tag';

/*
import {
  userAvatarFragment,
  tagFragment,
  partnerCardFragment,
  documentFragment,
  shipmentCardFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  batchFormFragment,
} from 'graphql';

${userAvatarFragment}
${tagFragment}
${partnerCardFragment}
${documentFragment}
${shipmentCardFragment}
${priceFragment}
${imageFragment}
${partnerNameFragment}
${batchFormFragment}
*/
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

/*
import { partnerNameFragment, tagFragment, priceFragment, userAvatarFragment } from 'graphql';

${partnerNameFragment}
${tagFragment}
${priceFragment}
${userAvatarFragment}
*/
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
