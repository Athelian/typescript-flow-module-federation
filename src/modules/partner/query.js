// @flow
import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const partnersExportQuery = gql`
  query partnersExport(
    $templateId: ID!
    $filterBy: PartnerFilterInput
    $sortBy: PartnerSortInput
    $localSortBy: [GenericSortInput!]
    $columns: [String!]
  ) {
    partnersExport(
      templateId: $templateId
      columns: $columns
      filterBy: $filterBy
      sortBy: $sortBy
      localSortBy: $localSortBy
    ) {
      ... on Export {
        id
      }
    }
  }
`;
