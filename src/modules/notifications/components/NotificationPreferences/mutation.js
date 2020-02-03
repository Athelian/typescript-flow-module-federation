// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const notificationPreferencesUpdateMutation = gql`
  mutation notificationPreferencesUpdate($input: NotificationPreferencesInput!) {
    notificationPreferencesUpdate(input: $input) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default notificationPreferencesUpdateMutation;
