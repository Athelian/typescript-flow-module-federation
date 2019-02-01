import gql from 'graphql-tag';

export const containerCardFragment = gql`
  fragment containerCardFragment on Container {
    id
    no
    representativeBatch {
      ... on Batch {
        id
        orderItem {
          ... on OrderItem {
            id
            productProvider {
              ... on ProductProvider {
                id
                product {
                  ... on Product {
                    id
                    files {
                      ...imageFragment
                    }
                    name
                    serial
                  }
                }
              }
            }
          }
        }
      }
    }
    totalVolume {
      ...metricFragment
    }
    batches {
      ... on Batch {
        id
      }
    }
    warehouse {
      ... on Warehouse {
        id
        name
      }
    }
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedBy {
      ... on User {
        id
      }
    }
    warehouseArrivalActualDateApprovedBy {
      ... on User {
        id
      }
    }
    shipment {
      ... on Shipment {
        id
        no
      }
    }
    tags {
      ...tagFragment
    }
  }
`;

export const shipmentContainerCardFragment = gql`
  fragment shipmentContainerCardFragment on Container {
    id
    no
    representativeBatch {
      ...batchFormFragment
    }
    totalVolume {
      ...metricFragment
    }
    batches {
      ...batchFormFragment
    }
    warehouse {
      ... on Warehouse {
        id
        name
      }
    }
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedAt
    warehouseArrivalActualDateApprovedAt
    tags {
      ...tagFragment
    }
  }
`;

export default containerCardFragment;
