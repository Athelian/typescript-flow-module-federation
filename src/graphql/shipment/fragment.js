// @flow
import gql from 'graphql-tag';

export const shipmentFormFragment = gql`
  fragment shipmentFormFragment on Shipment {
    id
  }
`;

/*
import { timelineDateMinimalFragment, tagFragment, portFragment } from 'graphql';

${timelineDateMinimalFragment}
${tagFragment}
${portFragment}
*/
export const shipmentCardFragment = gql`
  fragment shipmentCardFragment on Shipment {
    id
    archived
    no
    blNo
    transportType
    cargoReady {
      ...timelineDateMinimalFragment
    }
    batches {
      id
    }
    tags {
      ...tagFragment
    }
    voyages {
      id
      departurePort {
        ...portFragment
      }
      arrivalPort {
        ...portFragment
      }
      departure {
        ...timelineDateMinimalFragment
      }
      arrival {
        ...timelineDateMinimalFragment
      }
    }
    containerGroups {
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
      warehouse {
        id
        name
      }
    }
  }
`;
