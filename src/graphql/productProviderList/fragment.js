// @flow
import gql from 'graphql-tag';

export const productProviderListFragment = gql`
  fragment productProviderListFragment on ProductProvider {
    id
    unitType
    unitPrice {
      amount
      currency
    }
    unitVolume {
      value
      metric
    }
    unitWeight {
      value
      metric
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
    packageCapacity
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
    memo
    product {
      id
      name
      serial
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

export default productProviderListFragment;
