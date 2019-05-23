// @flow
import gql from 'graphql-tag';
import {
  taskTemplateCardFragment,
  taskFormInSlideViewFragment,
  taskFormInTemplateFragment,
  todoFragment,
  userAvatarFragment,
  tagFragment,
} from 'graphql';

export const orderFormTasksQuery = gql`
  query orderFormTasksQuery($id: ID!) {
    order(id: $id) {
      ... on Order {
        id
        todo {
          ...todoFragment
          tasks {
            ...taskFormInSlideViewFragment
          }
          taskTemplate {
            ...taskTemplateCardFragment
          }
        }
      }
    }
  }

  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${taskFormInSlideViewFragment}
  ${todoFragment}
  ${userAvatarFragment}
  ${tagFragment}
`;

export default orderFormTasksQuery;
