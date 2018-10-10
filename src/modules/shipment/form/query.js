// @flow
import gql from 'graphql-tag';
import {
  timelineDateFullFragment,
  batchFormFragment,
  userAvatarFragment,
  metricFragment,
  sizeFragment,
  tagFragment,
  priceFragment,
  orderCardFragment,
  imageFragment,
  partnerNameFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  portFragment,
} from 'graphql';

export const shipmentFormQuery = gql`
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
        ...timelineDateFullFragment
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
          ...timelineDateFullFragment
        }
        arrival {
          ...timelineDateFullFragment
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
          ...timelineDateFullFragment
        }
        warehouseArrival {
          ...timelineDateFullFragment
        }
        deliveryReady {
          ...timelineDateFullFragment
        }
        id
        sort
      }
      batches {
        ...batchFormFragment
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

  ${timelineDateFullFragment}
  ${batchFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
`;

export default shipmentFormQuery;
