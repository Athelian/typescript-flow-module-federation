import gql from 'graphql-tag';

export const containerCardFragment = gql`
  fragment ContainerCardFragment on Container {
    id
    no
    representativeBatch {
      id
      orderItem {
        id
        productProvider {
          id
          product {
            id
            files {
              id
              name
              type
            }
            name
            serial
          }
        }
      }
    }
    totalVolume {
      value
      metric
    }
    batches {
      id
    }
    warehouse {
      id
      name
    }
    warehouseArrivalAgreedDate
    warehouseArrivalActualDate
    warehouseArrivalAgreedDateApprovedBy {
      id
    }
    warehouseArrivalActualDateApprovedBy {
      id
    }
    shipment {
      id
      no
    }
    tags {
      ...tagFragment
    }
  }
`;

export default containerCardFragment;
