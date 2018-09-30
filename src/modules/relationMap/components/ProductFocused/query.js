import gql from 'graphql-tag';

export const productListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        id
        quantity
        productProvider {
          product {
            id
            name
            serial
            tags {
              id
              name
              color
            }
          }
          supplier {
            id
            name
          }
        }
        batches {
          id
          no
          quantity
          archived
          shipment {
            id
            blNo
            containerGroups {
              warehouseArrival {
                date
              }
            }
          }
          packageVolume {
            value
            metric
          }
          batchAdjustments {
            id
            quantity
          }
        }
      }
      page
      totalPage
    }
  }
`;

export default productListQuery;
