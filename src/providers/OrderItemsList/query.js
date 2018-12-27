// @flow
import gql from 'graphql-tag';

import { metricFragment, sizeFragment, imageFragment, partnerCardFragment } from 'graphql';

export const orderItemsListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      page
      totalPage
      nodes {
        id
        price {
          amount
          currency
        }
        quantity
        batches {
          id
          quantity
        }
        order {
          id
          poNo
          issuedAt
          currency
          exporter {
            id
            name
          }
          tags {
            id
            name
            color
          }
          orderItems {
            id
            quantity
            price {
              amount
              currency
            }
            batches {
              id
              quantity
              batchAdjustments {
                id
                quantity
              }
            }
          }
        }
        productProvider {
          id
          packageName
          packageCapacity
          packageGrossWeight {
            ...metricFragment
          }
          packageVolume {
            ...metricFragment
          }
          packageSize {
            ...sizeFragment
          }
          product {
            id
            name
            serial
            files {
              ...imageFragment
            }
          }
          exporter {
            ...partnerCardFragment
          }
        }
      }
    }
  }

  ${metricFragment}
  ${sizeFragment}
  ${imageFragment}
  ${partnerCardFragment}
`;

export default orderItemsListQuery;
