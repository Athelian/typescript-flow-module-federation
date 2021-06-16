// @flow
import gql from 'graphql-tag';

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
