// @flow
import gql from 'graphql-tag';

export const productProviderFormFragment = gql`
  fragment productProviderFormFragment on ProductProvider {
    id
    archived
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    referenced
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
    customFields {
      ...customFieldsFragment
    }
  }
`;

export default productProviderFormFragment;
