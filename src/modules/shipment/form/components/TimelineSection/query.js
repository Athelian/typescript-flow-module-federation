// @flow
import gql from 'graphql-tag';
import { timelineDateFullFragment, userAvatarFragment, portFragment } from 'graphql';

export const shipmentFormTimelineQuery = gql`
  query shipmentFormTimelineQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        cargoReady {
          ...timelineDateFullFragment
        }
        voyages {
          ... on Voyage {
            id
            vesselName
            vesselCode
            departurePort {
              ...portFragment
            }
            arrivalPort {
              ...portFragment
            }
            departure {
              ...timelineDateFullFragment
            }
            arrival {
              ...timelineDateFullFragment
            }
          }
        }
        containerGroups {
          ... on ContainerGroup {
            id
            warehouse {
              ... on Warehouse {
                id
                name
                ownedBy {
                  ... on Group {
                    id
                    name
                  }
                }
              }
            }
            customClearance {
              ...timelineDateFullFragment
            }
            warehouseArrival {
              ...timelineDateFullFragment
            }
            deliveryReady {
              ...timelineDateFullFragment
            }
          }
        }
      }
    }
  }

  ${userAvatarFragment}
  ${timelineDateFullFragment}
  ${portFragment}
`;

export default shipmentFormTimelineQuery;
