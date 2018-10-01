import gql from 'graphql-tag';
// import { detailedBatchFragment } from 'graphql/batchDetail/fragment';

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
          }
          tags {
            id
            name
            color
          }
          transportType
          cargoReady {
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
              approvedAt
              date
              timelineDateRevisions {
                date
              }
            }
            arrival {
              approvedAt
              date
              timelineDateRevisions {
                date
              }
            }
          }
          containerGroups {
            customClearance {
              approvedAt
              date
              timelineDateRevisions {
                date
              }
            }
            warehouseArrival {
              approvedAt
              date
              timelineDateRevisions {
                date
              }
            }
            deliveryReady {
              approvedAt
              date
              timelineDateRevisions {
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
`;

export default orderListQuery;
