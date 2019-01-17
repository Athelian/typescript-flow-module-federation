import gql from 'graphql-tag';

export const containerListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: ContainerFilterInput, $sortBy: ContainerSortInput) {
    containers(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        representativeBatch {
          orderItem {
            id
            productProvider {
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
        id
        no
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
      }
      page
      totalPage
    }
  }
`;

export default containerListQuery;
