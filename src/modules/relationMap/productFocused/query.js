import gql from 'graphql-tag';

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
        id
        name
        serial
        archived
        productProviders {
          id
          exporter {
            id
            name
          }
          supplier {
            id
            name
          }
        }
        batches(page: $batchPage, perPage: $batchPerPage, sortBy: $batchSort) {
          nodes {
            id
            no
            quantity
            deliveredAt
            shipment {
              id
              no
              containerGroups {
                id
                warehouseArrival {
                  id
                  date
                }
              }
            }
            batchAdjustments {
              id
              reason
              quantity
              memo
              updatedAt
              updatedBy {
                firstName
                lastName
                id
              }
              sort
            }
            orderItem {
              id
              quantity
              order {
                id
                poNo
              }
            }
            tags {
              id
              name
              color
            }
          }
          totalCount
        }
        tags {
          id
          name
          color
        }
        files {
          name
          type
          path
          memo
          id
        }
      }
      page
      perPage
      totalPage
    }
  }
`;

export default productListQuery;
