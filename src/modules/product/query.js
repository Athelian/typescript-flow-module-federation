/* eslint-disable graphql/template-strings */
// @flow
import gql from 'graphql-tag';
import { commentFragment, eventFragment } from '../timeline/query';

export const productTimelineQuery = gql`
  query productTimeline($id: ID!, $page: Int!, $perPage: Int!) {
    product(id: $id) {
      ... on Product {
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

export const productExportQuery = gql`
  query productExport($id: ID!, $templateId: ID!) {
    productExport(id: $id, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;

export const productsExportQuery = gql`
  query productsExport($filterBy: ProductFilterInput, $sortBy: ProductSortInput, $templateId: ID!) {
    productsExport(filterBy: $filterBy, sortBy: $sortBy, templateId: $templateId) {
      ... on Export {
        id
      }
    }
  }
`;
