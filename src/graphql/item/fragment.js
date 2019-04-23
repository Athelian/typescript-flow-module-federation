// @flow
import gql from 'graphql-tag';

export const itemCardFragment = gql`
  fragment itemCardFragment on OrderItem {
    id
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
      }
    }
    totalBatched
    totalShipped
    batchCount
    batchShippedCount
    productProvider {
      ... on ProductProvider {
        id
        exporter {
          ...partnerNameFragment
        }
        supplier {
          ...partnerNameFragment
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
      }
    }
  }
`;

export const itemFormFragment = gql`
  fragment itemFormFragment on OrderItem {
    id
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
      tasks {
        ...taskFormInSlideViewFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    order {
      ... on Order {
        id
        poNo
        currency
      }
    }
    productProvider {
      ... on ProductProvider {
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
  }
`;

export const itemInSelectorFragment = gql`
  fragment itemInSelectorFragment on OrderItem {
    id
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
  }
`;

export const itemInBatchFormFragment = gql`
  fragment itemInBatchFormFragment on OrderItem {
    id
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
