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
    ownedBy {
      ...ownedByFragment
    }
    todo {
      tasks {
        ...taskFormInSlideViewFragment
      }
      taskTemplate {
        ...taskTemplateCardFragment
      }
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
      ...imageFragment
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
      ... on ProductProvider {
        id
        exporter {
          ...partnerNameFragment
        }
        supplier {
          ...partnerNameFragment
        }
      }
    }
    tags {
      ...tagFragment
    }
    todo {
      ...todoFragment
    }
    files {
      ...imageFragment
    }
  }
`;
