// @flow
import gql from 'graphql-tag';
import { detailedBatchFragment } from 'graphql/batchDetail/fragment';

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

export const orderDetailFragment = gql`
  fragment orderDetailFragment on Order {
    id
    archived
    poNo
    issuedAt
    piNo
    incoterm
    deliveryPlace
    currency
    memo
    createdAt
    updatedAt
    updatedBy {
      firstName
      lastName
    }
    tags {
      id
      name
      color
    }
    orderItems {
      id
      quantity
      price {
        amount
        currency
      }
      productProvider {
        id
        product {
          id
          name
          serial
          files {
            id
            path
          }
        }
        exporter {
          id
          name
        }
        supplier {
          id
          name
        }
      }
      batches {
        ...detailedBatchFragment
      }
    }
    inCharges {
      id
      firstName
      lastName
    }
    shipments {
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
      id
      tags {
        name
        color
        id
      }
    }
    files {
      id
      name
      path
      type
      memo
    }
    exporter {
      id
      name
      types
    }
  }

  ${detailedBatchFragment}
  ${timelineDateFragment}
`;

export const orderDetailQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      ...orderDetailFragment
    }
  }

  ${orderDetailFragment}
`;

export default orderDetailQuery;
