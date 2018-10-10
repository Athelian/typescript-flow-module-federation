// @flow
import gql from 'graphql-tag';

export const shipmentFormFragment = gql`
  fragment shipmentFormFragment on Shipment {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    no
    blNo
    blDate
    bookingNo
    bookingDate
    invoiceNo
    incoterm
    loadType
    transportType
    carrier
    forwarders {
      ...partnerCardFragment
    }
    inCharges {
      ...userAvatarFragment
    }
    tags {
      ...tagFragment
    }
    files {
      ...documentFragment
    }
    cargoReady {
      ...timelineDateFullFragment
    }
    voyages {
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
    containerGroups {
      id
      warehouse {
        id
        name
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
    batches {
      ...batchFormFragment
    }
  }
`;

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
