// @flow
import gql from 'graphql-tag';
import {
  tagFragment,
  imageFragment,
  priceFragment,
  partnerNameFragment,
  metricFragment,
  sizeFragment,
  taskCountFragment,
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
    # TODO: remove old field
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
  ${partnerNameFragment}
  ${tagFragment}
  ${imageFragment}
  ${priceFragment}
  ${metricFragment}
  ${sizeFragment}
  ${taskCountFragment}
`;
