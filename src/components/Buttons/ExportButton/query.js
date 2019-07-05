// @flow
import gql from 'graphql-tag';

export const exportTemplatesQuery = gql`
  query exportTemplates($filterBy: ExportTemplateFilterInput) {
    exportTemplates(filterBy: $filterBy) {
      ... on ExportTemplate {
        id
        name
        extension
      }
    }
  }
`;

export default exportTemplatesQuery;
