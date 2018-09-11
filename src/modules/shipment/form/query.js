// @flow
import gql from 'graphql-tag';
import { batchFragment } from 'modules/batch/form/query';

const timelineDateFragment = gql`
  fragment timelineDateFragment on TimelineDate {
    date
    assignedTo {
      firstName
      lastName
      avatar
      id
    }
    approvedBy {
      firstName
      lastName
      avatar
      id
    }
    approvedAt
    timelineDateRevisions {
      date
      type
      memo
      id
      updatedAt
      updatedBy {
        firstName
        lastName
        avatar
        id
      }
      sort
    }
    id
  }
`;

export const shipmentDetailQuery = gql`
  query($id: ID!) {
    shipment(id: $id) {
      archived
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
      cargoReady {
        ...timelineDateFragment
      }
      voyages {
        vesselName
        vesselCode
        departurePort
        arrivalPort
        departure {
          ...timelineDateFragment
        }
        arrival {
          ...timelineDateFragment
        }
        id
        sort
      }
      containerGroups {
        customClearance {
          ...timelineDateFragment
        }
        warehouseArrival {
          ...timelineDateFragment
        }
        deliveryReady {
          ...timelineDateFragment
        }
        id
        sort
      }
      batches {
        ...batchFragment
      }
      id
      updatedAt
      updatedBy {
        firstName
        lastName
        avatar
        id
      }
      tags {
        name
        color
        id
      }
    }
  }

  ${timelineDateFragment}
  ${batchFragment}
`;

export default shipmentDetailQuery;
