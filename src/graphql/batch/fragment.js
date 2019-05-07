// @flow
import gql from 'graphql-tag';
// @TODO change container field to use containerCardFragment
export const batchFormFragment = gql`
  fragment batchFormFragment on Batch {
    id
    archived
    totalAdjusted
    autoCalculatePackageQuantity
    autoCalculatePackageVolume
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    memo
    no
    quantity
    producedAt
    deliveredAt
    desiredAt
    expiredAt
    totalVolume {
      ...metricFragment
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
    customFields {
      ...customFieldsFragment
    }
    batchAdjustments {
      ... on BatchAdjustment {
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
      ...itemInBatchFormFragment
    }
    shipment {
      ...shipmentCardFragment
    }
    container {
      ... on Container {
        id
        no
        representativeBatch {
          ... on Batch {
            id
            orderItem {
              ... on OrderItem {
                id
                productProvider {
                  ... on ProductProvider {
                    id
                    product {
                      ... on Product {
                        id
                        files {
                          ...imageFragment
                        }
                        name
                        serial
                      }
                    }
                  }
                }
              }
            }
          }
        }
        totalVolume {
          value
          metric
        }
        batches {
          ... on Batch {
            id
          }
        }
        warehouse {
          ... on Warehouse {
            id
            name
          }
        }
        warehouseArrivalAgreedDate
        warehouseArrivalActualDate
        warehouseArrivalAgreedDateApprovedBy {
          ... on User {
            id
          }
        }
        warehouseArrivalActualDateApprovedBy {
          ... on User {
            id
          }
        }
        shipment {
          ... on Shipment {
            id
            no
          }
        }
        tags {
          ...tagFragment
        }
      }
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
    todo {
      ...todoFragment
    }
    packageVolume {
      ...metricFragment
    }
    packageQuantity
    batchAdjustments {
      ... on BatchAdjustment {
        id
        quantity
        sort
      }
    }
    tags {
      ...tagFragment
    }
    shipment {
      ... on Shipment {
        id
        no
      }
    }
    container {
      ... on Container {
        id
        no
      }
    }
    orderItem {
      ... on OrderItem {
        id
        price {
          ...priceFragment
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
            id
            name
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
    }
  }
`;
