// @flow
import gql from 'graphql-tag';
import { timelineDateMinimalFragment, userAvatarFragment } from 'graphql';

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

  ${userAvatarFragment}
  ${timelineDateMinimalFragment}
`;

export default shipmentAutoDateQuery;
