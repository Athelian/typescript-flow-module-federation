// @flow
import gql from 'graphql-tag';

export const orderFormFragment = gql`
  fragment orderFormFragment on Order {
    id
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
