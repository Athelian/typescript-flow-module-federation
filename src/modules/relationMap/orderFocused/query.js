import gql from 'graphql-tag';
import {
  sizeFragment,
  metricFragment,
  batchCardFragment,
  tagFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  orderCardFragment,
  userAvatarFragment,
} from 'graphql';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: OrderFilterInput, $sortBy: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...orderCardFragment
        id
        poNo
        piNo
        issuedAt
        currency
        incoterm
        deliveryPlace
        memo
        tags {
          name
          id
          color
        }
        inCharges {
          id
          firstName
          lastName
        }
        exporter {
          id
          name
        }
        shipments {
          id
          no
          blNo
          blDate
          batches {
            id
            packageVolume {
              ...metricFragment
            }
            packageQuantity
          }
          tags {
            id
            name
            color
          }
          transportType
          cargoReady {
            id
            approvedAt
            date
            timelineDateRevisions {
              id
              date
            }
          }
          voyages {
            id
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
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
            arrival {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
          }
          containerGroups {
            customClearance {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
            warehouse {
              id
            }
            warehouseArrival {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
            deliveryReady {
              id
              approvedAt
              date
              timelineDateRevisions {
                id
                date
              }
            }
          }
        }
        updatedAt
        createdAt
        orderItems {
          id
          quantity
          price {
            amount
            currency
          }
          productProvider {
            id
            exporter {
              id
              name
            }
            supplier {
              id
              name
            }
            product {
              id
              name
              serial
            }
          }
          order {
            id
            currency
            exporter {
              id
              name
              types
            }
            orderItems {
              id
            }
          }
          batches {
            ...batchCardFragment
            producedAt
            deliveredAt
            expiredAt
            packageName
            packageCapacity
            packageQuantity
            packageGrossWeight {
              ...metricFragment
            }
            packageVolume {
              ...metricFragment
            }
            packageSize {
              ...sizeFragment
            }
            shipment {
              id
              blNo
              containerGroups {
                warehouseArrival {
                  id
                  date
                }
              }
            }
          }
        }
      }
      page
      totalPage
    }
  }
  ${userAvatarFragment}
  ${sizeFragment}
  ${metricFragment}
  ${batchCardFragment}
  ${tagFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${orderCardFragment}
`;

export default orderListQuery;
