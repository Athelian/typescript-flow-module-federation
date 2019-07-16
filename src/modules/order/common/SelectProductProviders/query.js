// @flow
import gql from 'graphql-tag';
import {
  imageFragment,
  partnerNameFragment,
  metricFragment,
  sizeFragment,
  taskCountFragment,
  productProviderPackagingFragment,
} from 'graphql';

// only for order form "NEW ITEMS"
const productProviderCardFragment = gql`
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
          ... on Tag {
            id
            name
            color
            entityTypes
          }
        }
        files {
          ...imageFragment
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

export const productProvidersListQuery = gql`
  query productProvidersListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: ProductProviderFilterInput
    $sortBy: ProductProviderSortInput
  ) {
    productProviders(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...productProviderCardFragment
      }
      page
      totalPage
    }
  }

  ${productProviderCardFragment}
  ${productProviderPackagingFragment}
  ${partnerNameFragment}
  ${imageFragment}
  ${metricFragment}
  ${sizeFragment}
  ${taskCountFragment}
`;
