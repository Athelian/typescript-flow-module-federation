// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';
import { projectTemplateFormFragment } from 'graphql/projectTemplate/fragment';

export const projectTemplateFormQuery = gql`
  query projectTemplateFormQuery($id: ID!) {
    projectTemplate(id: $id) {
      ...projectTemplateFormFragment
    }
  }

  ${projectTemplateFormFragment}
  ${forbiddenFragment}
`;

export default projectTemplateFormQuery;
