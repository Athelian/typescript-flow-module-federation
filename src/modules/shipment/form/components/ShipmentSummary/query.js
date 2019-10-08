// @flow
import gql from 'graphql-tag';
import { taskCountFragment, metricFragment, portFragment, priceFragment } from 'graphql';

export const shipmentFormSummaryQuery = gql`
  query shipmentFormSummaryQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        totalPackageQuantity
        totalPackageQuantityOverride
        totalPackageQuantityOverriding
        totalVolumeOverride {
          ...metricFragment
        }
        totalVolumeOverriding
        totalWeightOverride {
          ...metricFragment
        }
        totalWeightOverriding
        orderCount
        batchCount
        containerCount
        containerTypeCounts {
          ... on ContainerTypeCount {
            containerType
            count
          }
        }
        totalVolume {
          ...metricFragment
        }
        files {
          ... on File {
            id
          }
        }
        containers {
          ... on Container {
            id
          }
        }
        batches {
          ... on Batch {
            id
            quantity
            latestQuantity
            packageQuantity
            # TODO: remove when API has total weight
            packageGrossWeight {
              ...metricFragment
            }
            batchQuantityRevisions {
              ... on BatchQuantityRevision {
                id
                quantity
              }
            }
            orderItem {
              ... on OrderItem {
                id
                # TODO: remove when calculate for total price is ready
                price {
                  ...priceFragment
                }
                # TODO: remove when calculate for total product is ready
                productProvider {
                  ... on ProductProvider {
                    id
                    product {
                      ... on Product {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
        voyages {
          ... on Voyage {
            id
            vesselName
            departurePort {
              ...portFragment
            }
            arrivalPort {
              ...portFragment
            }
          }
        }
        todo {
          ... on Todo {
            tasks {
              ... on Task {
                id
              }
            }
            taskCount {
              ...taskCountFragment
            }
          }
        }
      }
    }
  }

  ${metricFragment}
  ${portFragment}
  ${priceFragment}
  ${taskCountFragment}
`;

export default shipmentFormSummaryQuery;
