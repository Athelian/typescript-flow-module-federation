import gql from 'graphql-tag';
import { metricFragment } from 'graphql';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        id
        poNo
        piNo
        issuedAt
        currency
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
          blNo
          blDate
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
            vesselName
            vesselCode
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
            warehouse {
              id
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
          price {
            amount
            currency
          }
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
          order {
            id
            orderItems {
              id
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
