// @flow
import gql from 'graphql-tag';
import { batchFragment } from 'modules/batch/form/query';
import { timelineDateFragment } from 'graphql/timeline/fragment';

export const shipmentListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: ShipmentFilterInput, $sort: ShipmentSortInput) {
    shipments(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        no
        blNo
        transportType
        archived
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
          warehouse {
            id
            name
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
