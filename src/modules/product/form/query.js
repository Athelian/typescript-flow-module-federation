// @flow
import gql from 'graphql-tag';

export const productFormQuery = gql`
  query($id: ID!) {
    product(id: $id) {
      archived
      name
      serial
      hsCode
      janCode
      material
      productProviders {
        exporter {
          name
          id
        }
        supplier {
          name
          id
        }
        unitType
        unitVolume {
          value
          metric
        }
        unitWeight {
          value
          metric
        }
        unitPrice {
          amount
          currency
        }
        inspectionFee {
          amount
          currency
        }
        origin
        productionLeadTime
        memo
        id
        updatedAt
        updatedBy {
          firstName
          lastName
          id
        }
        sort
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
      files {
        name
        type
        path
        memo
        id
      }
    }
  }
`;

export default productFormQuery;
