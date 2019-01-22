// @flow
import gql from 'graphql-tag';

import { metricFragment, sizeFragment, imageFragment, partnerCardFragment } from 'graphql';

export const orderItemsListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderItemFilterInput, $sortBy: OrderItemSortInput) {
    orderItems(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      page
      totalPage
      nodes {
        ... on OrderItem {
          id
          price {
            amount
            currency
          }
          quantity
          batches {
            ... on Batch {
              id
              quantity
            }
          }
          order {
            ... on Order {
              id
              poNo
              issuedAt
              currency
              exporter {
                ... on Group {
                  id
                  name
                }
              }
              tags {
                ... on Tag {
                  id
                  name
                  color
                }
              }
              orderItems {
                ... on OrderItem {
                  id
                  quantity
                  price {
                    amount
                    currency
                  }
                  batches {
                    ... on Batch {
                      id
                      quantity
                      batchAdjustments {
                        ... on BatchAdjustment {
                          id
                          quantity
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          productProvider {
            ... on ProductProvider {
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
                ... on Product {
                  id
                  name
                  serial
                  files {
                    ...imageFragment
                  }
                }
              }
              exporter {
                ...partnerCardFragment
              }
            }
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
