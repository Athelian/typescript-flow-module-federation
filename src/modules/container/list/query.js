import gql from 'graphql-tag';

export const containerListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ContainerFilterInput, $sortBy: ContainerSortInput) {
    containers(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        id
        no
        representativeBatch {
          id
          orderItem {
            id
            productProvider {
              id
              product {
                id
                files {
                  id
                  name
                  type
                }
                name
                serial
              }
            }
          }
        }
        totalVolume {
          value
          metric
        }
        batches {
          id
        }
        warehouse {
          id
          name
        }
        warehouseArrivalAgreedDate
        warehouseArrivalActualDate
        warehouseArrivalAgreedDateApprovedBy {
          id
        }
        warehouseArrivalActualDateApprovedBy {
          id
        }
        shipment {
          id
          no
        }
      }
      page
      totalPage
    }
  }
`;

export default containerListQuery;
