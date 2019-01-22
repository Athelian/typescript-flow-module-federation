import gql from 'graphql-tag';

export const containerCardFragment = gql`
  fragment ContainerCardFragment on Container {
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
                      ... on File {
                        id
                        name
                        type
                      }
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
      value
      metric
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

export default containerCardFragment;
