// @flow
import gql from 'graphql-tag';
import {
  milestoneCardFragment,
  projectCardNewFragment,
  milestoneFragment,
  taskTemplateCardFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskCountFragment,
  userAvatarFragment,
  tagFragment,
  forbiddenFragment,
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
  ${projectCardNewFragment}
  ${milestoneFragment}
  ${taskTemplateCardFragment}
  ${taskFormInTemplateFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${forbiddenFragment}
`;

export default shipmentFormTasksQuery;
