// @flow
import gql from 'graphql-tag';

export const productFormFragment = gql`
  fragment productFormFragment on Product {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    name
    serial
    hsCode
    janCode
    material
    tags {
      ...tagFragment
    }
    files {
      ...imageFragment
    }
    productProviders {
      id
      archived
      updatedAt
      updatedBy {
        ...userAvatarFragment
      }
      origin
      productionLeadTime
      exporter {
        ...partnerCardFragment
      }
      supplier {
        ...partnerCardFragment
      }
      inspectionFee {
        ...priceFragment
      }
      unitType
      unitPrice {
        ...priceFragment
      }
      unitWeight {
        ...metricFragment
      }
      unitVolume {
        ...metricFragment
      }
      unitSize {
        ...sizeFragment
      }
      packageName
      packageCapacity
      packageGrossWeight {
        ...metricFragment
      }
      packageVolume {
        ...metricFragment
      }
      packageSize {
        ...sizeFragment
      }
    }
  }
`;

export const productCardFragment = gql`
  fragment productCardFragment on Product {
    id
    archived
    name
    serial
    productProviders {
      id
      exporter {
        ...partnerNameFragment
      }
      supplier {
        ...partnerNameFragment
      }
    }
    tags {
      ...tagFragment
    }
    files {
      ...imageFragment
    }
  }
`;
