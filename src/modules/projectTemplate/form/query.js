// @flow
import gql from 'graphql-tag';

import { projectTemplateFormFragment } from 'graphql/projectTemplate/fragment';

export const projectTemplateFormQuery = gql`
  query projectTemplateFormQuery($id: ID!) {
    projectTemplate(id: $id) {
      nodes {
        ...projectTemplateFormFragment
      }
    }
  }

  ${projectTemplateFormFragment}
`;

export default projectTemplateFormQuery;
