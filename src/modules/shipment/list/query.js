// @flow
import gql from 'graphql-tag';

const userListFragment = gql`
  fragment userListFields on User {
    firstName
    lastName
  }
`;

export const timelineDateFragment = gql`
  fragment timelineDateFragment on TimelineDate {
    id
    estimatedDate
    actualDates {
      id
      date
      type
      memo
      createdAt
      updatedAt
      updatedBy {
        ...userListFields
      }
    }
    approvedAt
    approvedBy {
      ...userListFields
    }
    assignedTo {
      ...userListFields
    }
  }

  ${userListFragment}
`;

export const shipmentFragment = gql`
  fragment shipmentFields on Shipment {
    id
    no
    BL
    status
    exporter {
      id
      name
    }
    batchItems {
      id
    }
    tags {
      id
      name
      color
      description
    }
    transportType
    cargoReadyDate {
      ...timelineDateFragment
    }
    voyages {
      id
      vesselName
      voyageCode
      departureDate {
        ...timelineDateFragment
      }
      arrivalDate {
        ...timelineDateFragment
      }
      departurePort {
        ... on Seaport {
          locode: code
        }
        ... on Airport {
          iata: code
        }
      }
      arrivalPort {
        ... on Seaport {
          locode: code
        }
        ... on Airport {
          iata: code
        }
      }
    }
    containerGroups {
      id
      warehouse {
        id
        name
      }
      customClearanceDate {
        ...timelineDateFragment
      }
      warehouseArrivalDate {
        ...timelineDateFragment
      }
      deliveryReadyDate {
        ...timelineDateFragment
      }
    }
  }

  ${timelineDateFragment}
`;

export const shipmentListQuery = gql`
  query($filter: ShipmentFilterInput, $sort: SortInput, $page: Int!, $perPage: Int!) {
    viewer {
      shipments(filter: $filter, sort: $sort, page: $page, perPage: $perPage) {
        nodes {
          ...shipmentFields
        }
        page
        totalPage
      }
    }
  }

  ${shipmentFragment}
`;

export const parseShipmentData = (shipment: Object) => ({
  ...shipment,
  voyages: shipment.voyages.map(voyage => ({
    ...voyage,
    departurePort: voyage.departurePort
      ? voyage.departurePort.locode || voyage.departurePort.iata || null
      : null,
    arrivalPort: voyage.arrivalPort
      ? voyage.arrivalPort.locode || voyage.arrivalPort.iata || null
      : null,
  })),
});
