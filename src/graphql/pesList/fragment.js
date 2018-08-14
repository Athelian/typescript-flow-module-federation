// @flow
import gql from 'graphql-tag';

export const PESListFieldsFragment = gql`
  fragment PESListFields on ProductExporterSupplier {
    id
    price
    unit
    volume
    weight
    currency
    packageName
    packageGrossWeight
    packageVolume
    packageMaxQuantity
    packageSize
    memo
    product {
      id
      name
      serial
      files {
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
`;

export default PESListFieldsFragment;
