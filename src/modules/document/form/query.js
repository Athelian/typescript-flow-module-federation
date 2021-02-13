import gql from 'graphql-tag';
import {
  documentFormFragment,
  userAvatarFragment,
  ownedByFragment,
  orderCardFragment,
  itemCardFragment,
  shipmentCardFragment,
  productProviderCardFragment,
  milestoneCardFragment,
  partnerNameFragment,
  priceFragment,
  tagFragment,
  metricFragment,
  portFragment,
  timelineDateMinimalFragment,
  imageFragment,
  productProviderPackagingFragment,
  sizeFragment,
  badRequestFragment,
  forbiddenFragment,
  documentFragment,
} from 'graphql';
import { commentFragment, eventFragment } from 'modules/timeline/query';

export const documentQuery = gql`
  query documentQuery($id: ID!) {
    file(id: $id) {
      ...documentFormFragment
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${documentFormFragment}
  ${userAvatarFragment}
  ${ownedByFragment}
  ${orderCardFragment}
  ${itemCardFragment}
  ${shipmentCardFragment}
  ${productProviderCardFragment}
  ${milestoneCardFragment}
  ${partnerNameFragment}
  ${priceFragment}
  ${tagFragment}
  ${metricFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${imageFragment}
  ${productProviderPackagingFragment}
  ${sizeFragment}
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const documentTimelineQuery = gql`
  query documentTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    file(id: $id) {
      ... on File {
        id
        timeline {
          entries(page: $page, perPage: $perPage) {
            nodes {
              ...commentFragment
              ...eventFragment
            }
            page
            totalPage
          }
        }
      }
    }
  }

  ${eventFragment}
  ${commentFragment}
`;

export const orderItemFilesQuery = gql`
  query orderItemFilesQuery($id: ID!) {
    orderItem(id: $id) {
      ... on OrderItem {
        id
        files {
          ...documentFragment
          ...forbiddenFragment
        }
      }
    }
  }

  ${ownedByFragment}
  ${tagFragment}
  ${documentFragment}
  ${forbiddenFragment}
`;

export const productFilesQuery = gql`
  query productFilesQuery($id: ID!) {
    product(id: $id) {
      ... on Product {
        id
        productProviders {
          ... on ProductProvider {
            id
            name
            archived
            updatedAt
            updatedBy {
              ...userAvatarFragment
            }
            memo
            files {
              ...documentFragment
              ...forbiddenFragment
            }
          }
        }
      }
      ...forbiddenFragment
    }
  }

  ${userAvatarFragment}
  ${ownedByFragment}
  ${tagFragment}
  ${documentFragment}
  ${forbiddenFragment}
`;
