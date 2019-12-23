// @flow
import gql from 'graphql-tag';

export const productProviderPackagingFragment = gql`
  fragment productProviderPackagingFragment on ProductProviderPackage {
    id
    name
    capacity
    grossWeight {
      ...metricFragment
    }
    volume {
      ...metricFragment
    }
    autoCalculateVolume
    size {
      ...sizeFragment
    }
  }
`;

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
    exporter {
      ...partnerCardFragment
    }
    supplier {
      ...partnerCardFragment
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
    autoCalculateUnitVolume
    defaultPackage {
      ...productProviderPackagingFragment
    }
    packages {
      ...productProviderPackagingFragment
    }
    customFields {
      ...customFieldsFragment
    }
    memo
    files {
      ...documentFragment
      ...forbiddenFragment
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
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
    unitPrice {
      ...priceFragment
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
        ownedBy {
          ...ownedByFragment
        }
      }
    }
    defaultPackage {
      ...productProviderPackagingFragment
    }
    packages {
      ...productProviderPackagingFragment
    }
    todo {
      taskCount {
        ...taskCountFragment
      }
    }
  }
`;
