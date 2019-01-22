import gql from 'graphql-tag';
import { tagFragment } from 'graphql';

export const containerListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ContainerFilterInput, $sortBy: ContainerSortInput) {
    containers(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
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
      page
      totalPage
    }
  }
  ${tagFragment}
`;

export default containerListQuery;
