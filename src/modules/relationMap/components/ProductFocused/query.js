import gql from 'graphql-tag';

export const productListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        id
        quantity
        productProvider {
          id
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
          orderItem {
            id
            order {
              id
              poNo
            }
          }
          shipment {
            id
            blNo
            containerGroups {
              id
              warehouseArrival {
                id
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
