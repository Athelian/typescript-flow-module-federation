// @flow
import gql from 'graphql-tag';
import {
  forbiddenFragment,
  userAvatarFragment,
  metricFragment,
  sizeFragment,
  tagFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  ownedByFragment,
  milestoneCardFragment,
  projectCardFragment,
  taskWithoutParentInfoFragment,
  taskCountFragment,
  taskTemplateCardFragment,
  taskFormInTemplateFragment,
  itemInBatchFormFragment,
  productProviderPackagingFragment,
} from 'graphql';

export const selectBatchListQuery = gql`
  query selectBatchListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: BatchFilterInput
    $sortBy: BatchSortInput
  ) {
    batches(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Batch {
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
            ...forbiddenFragment
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
                ...forbiddenFragment
              }
            }
          }
        }
      }
      page
      totalPage
    }
  }

  ${forbiddenFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${ownedByFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${itemInBatchFormFragment}
  ${partnerCardFragment}
  ${productProviderPackagingFragment}
`;

export default selectBatchListQuery;
