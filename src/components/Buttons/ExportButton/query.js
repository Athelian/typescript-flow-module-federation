// @flow
import gql from 'graphql-tag';

export const exportTemplatesQuery = gql`
  query exportTemplates($filterBy: ExportTemplateFilterInput) {
    exportTemplates(filterBy: $filterBy) {
      id
      name
      extension
      dynamic
    }
  }
`;

export default exportTemplatesQuery;
