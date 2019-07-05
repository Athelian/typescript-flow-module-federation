// @flow
import gql from 'graphql-tag';
import { timelineDateMinimalFragment } from 'graphql';

export const shipmentAutoDateQuery = gql`
  query shipmentAutoDateQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        blDate
        bookingDate
        cargoReady {
          ...timelineDateMinimalFragment
        }
        voyages {
          ... on Voyage {
            id
            departure {
              ...timelineDateMinimalFragment
            }
            arrival {
              ...timelineDateMinimalFragment
            }
          }
        }
        containerGroups {
          ... on ContainerGroup {
            id
            customClearance {
              ...timelineDateMinimalFragment
            }
            warehouseArrival {
              ...timelineDateMinimalFragment
            }
            deliveryReady {
              ...timelineDateMinimalFragment
            }
          }
        }
      }
    }
  }

  ${timelineDateMinimalFragment}
`;

export default shipmentAutoDateQuery;
