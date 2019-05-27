// @flow
import gql from 'graphql-tag';

export const productProviderFormFragment = gql`
  fragment productProviderFormFragment on ProductProvider {
    id
    name
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
    autoCalculatePackageVolume
    autoCalculateUnitVolume
    packageSize {
      ...sizeFragment
    }
    customFields {
      ...customFieldsFragment
    }
    memo
    files {
      ...documentFragment
    }
    todo {
      tasks {
        ...taskFormInSlideViewFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
    }
  }
`;

export const productProviderCardFragment = gql`
  fragment productProviderCardFragment on ProductProvider {
    id
    archived
    name
    exporter {
      ...partnerNameFragment
    }
    supplier {
      ...partnerNameFragment
    }
    product {
      ... on Product {
        id
        name
        serial
        importer {
          ...partnerNameFragment
        }
        tags {
          ...tagFragment
        }
        files {
          ...imageFragment
        }
      }
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
    unitPrice {
      ...priceFragment
    }
    todo {
      ...todoFragment
    }
  }
`;
