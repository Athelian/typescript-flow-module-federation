// @flow
import gql from 'graphql-tag';

export const importEventSubscription = gql`
  subscription importEvent($importId: ID!) {
    importEvent(id: $importId) {
      lifecycle
      sheet
      error
      violations {
        path
        message
        error
        parameters {
          key
          value
        }
      }
    }
  }
`;

export default importEventSubscription;
