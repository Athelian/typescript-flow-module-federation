// @flow
import gql from 'graphql-tag';

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    shipments(page: $page, perPage: $perPage) {
      nodes {
        id
        transportType
        cargoReady {
          approvedAt
          date
          timelineDateRevisions {
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
        batches {
          no
          quantity
          packageQuantity
          orderItem {
            id
            quantity
            order {
              id
              poNo
            }
          }
        }
      }
      page
      totalPage
    }
  }
`;

export default shipmentListQuery;
