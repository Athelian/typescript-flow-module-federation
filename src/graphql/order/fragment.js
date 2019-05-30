// @flow
import gql from 'graphql-tag';

export const orderFormQueryFragment = gql`
  fragment orderFormQueryFragment on Order {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    memo
    poNo
    currency
    totalPrice {
      ...priceFragment
    }
    totalOrdered
    totalBatched
    totalShipped
    orderItemCount
    batchCount
    batchShippedCount
    shipmentCount
    issuedAt
    piNo
    incoterm
    deliveryPlace
    customFields {
      ...customFieldsFragment
    }
    importer {
      ...partnerCardFragment
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
  }
`;

export const orderFormFragment = gql`
  fragment orderFormFragment on Order {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    memo
    poNo
    currency
    totalOrdered
    totalBatched
    totalShipped
    orderItemCount
    batchCount
    batchShippedCount
    shipmentCount
    issuedAt
    piNo
    incoterm
    deliveryPlace
    customFields {
      ...customFieldsFragment
    }
    importer {
      ...partnerCardFragment
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
    todo {
      ...todoFragment
      tasks {
        ...taskFormInSlideViewFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    files {
      ...documentFragment
    }
    orderItems {
      ...itemInOrderFormFragment
    }
    shipments {
      ...shipmentCardFragment
    }
    containers {
      ...containerCardFragment
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
    todo {
      ...todoFragment
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
    importer {
      ...partnerNameFragment
    }
    exporter {
      ...partnerNameFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      ...todoFragment
    }
    inCharges {
      ...userAvatarFragment
    }
    currency
  }
`;
