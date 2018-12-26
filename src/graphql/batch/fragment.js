// @flow
import gql from 'graphql-tag';

export const batchFormFragment = gql`
  fragment batchFormFragment on Batch {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    memo
    no
    quantity
    producedAt
    deliveredAt
    desiredAt
    expiredAt
    customFields {
      ...customFieldsFragment
    }
    batchAdjustments {
      id
      sort
      updatedAt
      updatedBy {
        ...userAvatarFragment
      }
      reason
      quantity
      memo
    }
    packageName
    packageCapacity
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
    tags {
      ...tagFragment
    }
    orderItem {
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
      order {
        ...orderCardFragment
      }
      productProvider {
        id
        packageName
        packageCapacity
        packageGrossWeight {
          ...metricFragment
        }
        packageVolume {
          ...metricFragment
        }
        packageSize {
          ...sizeFragment
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
          ...partnerCardFragment
        }
        supplier {
          ...partnerNameFragment
        }
      }
    }
    shipment {
      ...shipmentCardFragment
    }
  }
`;

export const batchCardFragment = gql`
  fragment batchCardFragment on Batch {
    id
    no
    archived
    quantity
    deliveredAt
    desiredAt
    packageVolume {
      ...metricFragment
    }
    packageQuantity
    batchAdjustments {
      id
      quantity
      sort
    }
    tags {
      ...tagFragment
    }
    shipment {
      id
      no
    }
    orderItem {
      id
      price {
        ...priceFragment
      }
      order {
        ...orderCardFragment
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
    }
  }
`;
