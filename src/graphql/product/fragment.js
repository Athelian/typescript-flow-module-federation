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
    customFields {
      ...customFieldsFragment
    }
    tags {
      ...tagFragment
    }
    files {
      ...imageMediumFragment
    }
    productProviders {
      ...productProviderFormFragment
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
      ...imageMediumFragment
    }
  }
`;
