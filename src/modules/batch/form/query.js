// @flow
import gql from 'graphql-tag';
import { timelineDateFragment } from 'graphql/timeline/fragment';

export const batchFragment = gql`
  fragment batchFragment on Batch {
    archived
    orderItem {
      id
      quantity
      price {
        amount
        currency
      }
      order {
        id
        poNo
        currency
        archived
        exporter {
          id
          name
          types
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
          batches {
            id
            quantity
            batchAdjustments {
              id
              quantity
            }
          }
        }
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
          types
        }
        supplier {
          id
          name
          types
        }
      }
    }
    shipment {
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
        warehouse {
          id
          name
        }
        id
        sort
      }
      batches {
        id
      }
      id
      tags {
        name
        color
        id
      }
    }
    no
    quantity
    packageQuantity
    producedAt
    deliveredAt
    expiredAt
    batchAdjustments {
      reason
      quantity
      memo
      id
      updatedAt
      updatedBy {
        firstName
        lastName
        id
      }
      sort
    }
    id
    updatedAt
    updatedBy {
      firstName
      lastName
      id
    }
    packageName
    packageGrossWeight {
      value
      metric
    }
    packageVolume {
      value
      metric
    }
    packageSize {
      length {
        value
        metric
      }
      width {
        value
        metric
      }
      height {
        value
        metric
      }
    }
    packageCapacity
    tags {
      name
      color
      id
    }
  }

  ${timelineDateFragment}
`;

export const batchDetailQuery = gql`
  query($id: ID!) {
    batch(id: $id) {
      ...batchFragment
    }
  }

  ${batchFragment}
`;

export default batchDetailQuery;
