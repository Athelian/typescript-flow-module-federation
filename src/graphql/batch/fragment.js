// @flow
import gql from 'graphql-tag';
// @TODO change container field to use containerCardFragment
export const batchFormFragment = gql`
  fragment batchFormFragment on Batch {
    id
    archived
    autoCalculatePackageQuantity
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
      ... on OrderItem {
        id
        quantity
        price {
          ...priceFragment
        }
        batches {
          ... on Batch {
            id
            quantity
            batchAdjustments {
              ... on BatchAdjustment {
                id
                quantity
              }
            }
            shipment {
              ... on Shipment {
                id
              }
            }
          }
        }
        order {
          ...orderCardFragment
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
              ...partnerCardFragment
            }
            supplier {
              ...partnerNameFragment
            }
          }
        }
      }
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
                          ... on File {
                            id
                            name
                            type
                          }
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
          ...orderCardFragment
        }
        productProvider {
          ... on ProductProvider {
            id
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
      }
    }
  }
`;
