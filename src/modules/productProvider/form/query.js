// @flow
import gql from 'graphql-tag';

export const productProviderFragment = gql`
  fragment productProviderFragment on ProductProvider {
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
`;

export const productProviderDetailQuery = gql`
  query($id: ID!) {
    productProvider(id: $id) {
      ...productProviderFragment
    }
  }

  ${productProviderFragment}
`;

export default productProviderDetailQuery;
