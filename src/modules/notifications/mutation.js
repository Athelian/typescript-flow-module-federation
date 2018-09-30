// @flow
import gql from 'graphql-tag';

const notificationReadMutation = gql`
  mutation notificationRead($id: ID!) {
    notificationRead(id: $id)
  }
`;

export default notificationReadMutation;
