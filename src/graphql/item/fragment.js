// @flow
import gql from 'graphql-tag';

export const itemCardFragment = gql`
  fragment itemCardFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      ...todoFragment
    }
    order {
      ... on Order {
        id
        poNo
        importer {
          ...partnerNameFragment
        }
        exporter {
          ...partnerNameFragment
        }
      }
    }
    totalBatched
    totalShipped
    batchCount
    batchShippedCount
    productProvider {
      ... on ProductProvider {
        id
        name
        product {
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
  }
`;

export const itemCardWithOwnedFragment = gql`
  fragment itemCardWithOwnedFragment on OrderItem {
    id
    ownedBy {
      ...ownedByFragment
    }
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      ...todoFragment
    }
    order {
      ... on Order {
        id
        poNo
        importer {
          ...partnerNameFragment
        }
        exporter {
          ...partnerNameFragment
        }
      }
    }
    totalBatched
    totalShipped
    batchCount
    batchShippedCount
    productProvider {
      ... on ProductProvider {
        id
        name
        product {
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
  }
`;

export const itemFormFragment = gql`
  fragment itemFormFragment on OrderItem {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    no
    quantity
    price {
      ...priceFragment
    }
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
    }
    memo
    todo {
      ...todoFragment
      tasks {
        ...taskFormInSlideViewFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    order {
      ...orderCardFragment
    }
    productProvider {
      ...productProviderCardFragment
    }
    batches {
      ...batchFormFragment
    }
    files {
      ...documentFragment
    }
    shipments {
      ...shipmentCardFragment
    }
  }
`;

export const itemInSelectorFragment = gql`
  fragment itemInSelectorFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      ...todoFragment
    }
    order {
      ...orderCardFragment
    }
    totalBatched
    totalShipped
    batchCount
    batchShippedCount
    productProvider {
      ... on ProductProvider {
        id
        name
        exporter {
          ...partnerCardFragment
        }
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
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
  }
`;

export const itemInOrderFormFragment = gql`
  fragment itemInOrderFormFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
    }
    memo
    todo {
      ...todoFragment
      tasks {
        ...taskFormInSlideViewFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    productProvider {
      ... on ProductProvider {
        id
        name
        exporter {
          ...partnerNameFragment
        }
        supplier {
          ...partnerNameFragment
        }
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
          ...priceFragment
        }
        product {
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
    batches {
      ...batchFormFragment
    }
    files {
      ...documentFragment
    }
  }
`;

export const itemInBatchFormFragment = gql`
  fragment itemInBatchFormFragment on OrderItem {
    id
    archived
    no
    quantity
    price {
      ...priceFragment
    }
    tags {
      ...tagFragment
    }
    todo {
      ...todoFragment
    }
    order {
      ...orderCardFragment
    }
    totalBatched
    totalShipped
    batchCount
    batchShippedCount
    productProvider {
      ... on ProductProvider {
        id
        name
        exporter {
          ...partnerCardFragment
        }
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
          ... on Product {
            id
            name
            serial
            tags {
              ...tagFragment
            }
            files {
              ...imageFragment
            }
          }
        }
      }
    }
  }
`;
