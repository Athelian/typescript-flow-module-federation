// @flow
import gql from 'graphql-tag';
import { batchFragment } from 'modules/batch/form/query';
import { timelineDateFragment } from 'graphql/timeline/fragment';

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
        departurePort {
          seaport
          airport
        }
        arrivalPort {
          seaport
          airport
        }
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
        warehouse {
          id
          name
        }
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
        id
      }
      tags {
        name
        color
        id
      }
      forwarders {
        id
        name
        types
      }
      inCharges {
        id
        firstName
        lastName
      }
      files {
        id
        name
        type
        memo
        path
      }
    }
  }

  ${timelineDateFragment}
  ${batchFragment}
`;

export default shipmentDetailQuery;
