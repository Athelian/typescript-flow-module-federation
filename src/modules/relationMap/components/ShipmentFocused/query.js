// @flow
import gql from 'graphql-tag';

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    shipments(page: $page, perPage: $perPage) {
      nodes {
        id
        no
        tags {
          id
          name
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
        batches {
          id
          no
          quantity
          packageQuantity
          packageVolume {
            value
            metric
          }
          orderItem {
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
            order {
              id
              poNo
              tags {
                name
                id
              }
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
