import gql from 'graphql-tag';
// import { detailedBatchFragment } from 'graphql/batchDetail/fragment';
import { metricFragment } from 'graphql';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        id
        poNo
        issuedAt
        tags {
          name
          id
          color
        }
        exporter {
          id
          name
        }
        shipments {
          id
          no
          batches {
            id
            packageVolume {
              ...metricFragment
            }
          }
          tags {
            id
            name
            color
          }
          transportType
          cargoReady {
            id
            approvedAt
            date
            timelineDateRevisions {
              id
              date
            }
          }
          voyages {
            id
            departurePort {
              seaport
              airport
            }
            arrivalPort {
              seaport
              airport
            }
            departure {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
            arrival {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
          }
          containerGroups {
            customClearance {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
            warehouseArrival {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
            deliveryReady {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
          }
        }
        updatedAt
        createdAt
        orderItems {
          id
          quantity
          productProvider {
            id
            supplier {
              id
              name
            }
            product {
              id
              name
              serial
            }
          }
          batches {
            id
            no
            quantity
            archived
            deliveredAt
            orderItem {
              id
            }
            tags {
              id
              name
              color
            }
            shipment {
              id
              blNo
              containerGroups {
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
              quantity
            }
          }
        }
      }
      page
      totalPage
    }
  }

  ${metricFragment}
`;

export default orderListQuery;
