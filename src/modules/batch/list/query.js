// @flow
import gql from 'graphql-tag';

export const batchListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: BatchFilterInput, $sort: BatchSortInput) {
    batches(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        orderItem {
          id
          quantity
          price {
            amount
            currency
          }
          order {
            id
            poNo
            currency
          }
          productProvider {
            id
            product {
              id
              name
              serial
              files {
                id
                path
              }
            }
            exporter {
              id
              name
            }
            supplier {
              id
              name
            }
          }
        }
        shipment {
          id
          no
        }
        no
        quantity
        deliveredAt
        id
        batchAdjustments {
          quantity
          id
          sort
        }
        packageVolume {
          value
          metric
        }
        tags {
          id
          name
          color
        }
      }
      page
      totalPage
    }
  }
`;

export default batchListQuery;
