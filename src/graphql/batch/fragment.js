// @flow
import gql from 'graphql-tag';

export const batchFormFragment = gql`
  fragment batchFormFragment on Batch {
    id
    sort
    shipmentSort
    archived
    autoCalculatePackageQuantity
    autoCalculatePackageVolume
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    followers {
      ...userAvatarFragment
    }
    ... on Followed {
      notificationUnseenCount
    }
    memo
    no
    quantity
    producedQuantity
    preShippedQuantity
    shippedQuantity
    postShippedQuantity
    deliveredQuantity
    latestQuantity
    producedAt
    deliveredAt
    desiredAt
    expiredAt
    totalVolume {
      ...metricFragment
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
      tasks {
        ...taskWithoutParentInfoFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
    customFields {
      ...customFieldsFragment
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
        ... on Followed {
          notificationUnseenCount
        }
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
    producedQuantity
    preShippedQuantity
    shippedQuantity
    postShippedQuantity
    deliveredQuantity
    latestQuantity
    deliveredAt
    desiredAt
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
    packageVolume {
      ...metricFragment
    }
    packageQuantity
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
            importer {
              ...partnerNameFragment
            }
            exporter {
              ...partnerNameFragment
            }
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

export const batchCardWithOwnedFragment = gql`
  fragment batchCardWithOwnedFragment on Batch {
    ...batchCardFragment
    ownedBy {
      ...ownedByFragment
    }
  }
`;
