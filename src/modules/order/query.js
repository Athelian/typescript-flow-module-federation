/* eslint-disable graphql/template-strings */
// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from 'modules/timeline/query';

export const orderTimelineQuery = gql`
  query orderTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    order(id: $id) {
      ... on Order {
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

export const orderExportQuery = gql`
  query orderExport($id: ID!, $templateId: ID!) {
    orderExport(id: $id, templateId: $templateId) {
      ... on File {
        path
      }
    }
  }
`;

export const ordersExportQuery = gql`
  query ordersExport($filterBy: OrderFilterInput, $sortBy: OrderSortInput, $templateId: ID!) {
    ordersExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId) {
      ... on File {
        path
      }
    }
  }
`;
