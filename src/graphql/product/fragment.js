// @flow
import gql from 'graphql-tag';

export const productFormFragment = gql`
  fragment productFormFragment on Product {
    id
    archived
    updatedAt
    importer {
      ...partnerCardFragment
    }
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    todo {
      tasks {
        ...taskWithoutParentInfoFragment
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
    memo
    files {
      ...imageFragment
    }
    productProviders {
      ...productProviderFormFragment
      ...forbiddenFragment
    }
  }
`;

export const productCardFragment = gql`
  fragment productCardFragment on Product {
    id
    ownedBy {
      ...ownedByFragment
    }
    archived
    name
    serial
    importer {
      ...partnerNameFragment
    }
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
      taskCount {
        ...taskCountFragment
      }
    }
    files {
      ...imageFragment
    }
  }
`;

export const productCardWithOwnedFragment = gql`
  fragment productCardWithOwnedFragment on Product {
    ...productCardFragment
    ownedBy {
      ...ownedByFragment
    }
  }
`;
