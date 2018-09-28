// @flow
import gql from 'graphql-tag';
import { batchFragment } from 'modules/batch/form/query';

const timelineDateFragment = gql`
  fragment timelineDateFragment on TimelineDate {
    date
    approvedAt
    timelineDateRevisions {
      date
      id
      sort
    }
    id
  }
`;

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: ShipmentFilterInput, $sort: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        no
        blNo
        transportType
        cargoReady {
          ...timelineDateFragment
        }
        voyages {
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
        tags {
          name
          color
          id
        }
      }
      page
      totalPage
    }
  }

  ${timelineDateFragment}
  ${batchFragment}
`;

export default shipmentListQuery;
