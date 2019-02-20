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
      ... on OrderItem {
        id
        quantity
        price {
          ...priceFragment
        }
        productProvider {
          ... on ProductProvider {
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
            unitPrice {
              currency
              amount
            }
            product {
              ... on Product {
                id
                name
                serial
                files {
                  ...imageFragment
                }
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
        batches {
          ...batchFormFragment
        }
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
    totalPrice {
      ...priceFragment
    }
    orderItems {
      ... on OrderItem {
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
                files {
                  ...imageFragment
                }
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
        batches {
          ...batchFormFragment
        }
      }
    }
  }
`;

export const orderCardFragment = gql`
  fragment orderCardFragment on Order {
    id
    archived
    poNo
    issuedAt
    totalPrice {
      ...priceFragment
    }
    totalOrdered
    totalBatched
    totalShipped
    orderItemCount
    batchCount
    batchShippedCount
    exporter {
      ...partnerNameFragment
    }
    tags {
      ...tagFragment
    }
    inCharges {
      ...userAvatarFragment
    }
  }
`;
