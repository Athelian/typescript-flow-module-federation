import gql from 'graphql-tag';
import { timelineDateMinimalFragment, userAvatarFragment } from 'graphql';

export const productListQuery = gql`
  query(
    $page: Int!
    $perPage: Int!
    $filterBy: ProductFilterInput
    $sortBy: ProductSortInput
    $batchPage: Int!
    $batchPerPage: Int!
    $batchSort: BatchSortInput
  ) {
    products(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ... on Product {
          id
          name
          serial
          archived
          productProviders {
            ... on ProductProvider {
              id
              exporter {
                ... on Group {
                  id
                  name
                }
              }
              supplier {
                ... on Group {
                  id
                  name
                }
              }
            }
          }
          batches(page: $batchPage, perPage: $batchPerPage, sortBy: $batchSort) {
            nodes {
              ... on Batch {
                id
                no
                latestQuantity
                shipment {
                  ... on Shipment {
                    id
                    no
                    containerGroups {
                      ... on ContainerGroup {
                        id
                        warehouseArrival {
                          ...timelineDateMinimalFragment
                        }
                      }
                    }
                    containers {
                      ... on Container {
                        id
                      }
                    }
                  }
                }
                container {
                  ... on Container {
                    id
                    no
                    warehouseArrivalAgreedDate
                    warehouseArrivalAgreedDateApprovedAt
                    warehouseArrivalActualDate
                    warehouseArrivalActualDateApprovedAt
                  }
                }
                orderItem {
                  ... on OrderItem {
                    id
                    order {
                      ... on Order {
                        id
                        poNo
                      }
                    }
                  }
                }
                tags {
                  ... on Tag {
                    id
                    name
                    color
                  }
                }
              }
            }
            totalCount
          }
          tags {
            ... on Tag {
              id
              name
              color
            }
          }
          files {
            ... on File {
              id
              name
              type
              path
              memo
            }
          }
        }
      }
      page
      perPage
      totalPage
    }
  }

  ${timelineDateMinimalFragment}
  ${userAvatarFragment}
`;

export default productListQuery;
