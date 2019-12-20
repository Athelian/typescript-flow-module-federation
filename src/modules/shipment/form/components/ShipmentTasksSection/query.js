// @flow
import gql from 'graphql-tag';
import {
  milestoneCardFragment,
  projectCardFragment,
  taskTemplateCardFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskCountFragment,
  userAvatarFragment,
  tagFragment,
  forbiddenFragment,
  ownedByFragment,
} from 'graphql';

export const shipmentFormTasksQuery = gql`
  query shipmentFormTasksQuery($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        todo {
          taskCount {
            ...taskCountFragment
          }
          tasks {
            ...taskWithoutParentInfoFragment
            ...forbiddenFragment
          }
          taskTemplate {
            ...taskTemplateCardFragment
            ...forbiddenFragment
          }
        }
      }
    }
  }

  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${forbiddenFragment}
  ${ownedByFragment}
`;

export default shipmentFormTasksQuery;
