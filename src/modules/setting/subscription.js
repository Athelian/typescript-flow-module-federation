// @flow
import gql from 'graphql-tag';

const notificationNewSubScription = gql`
  subscription notificationNew {
    notificationNew {
      id
    }
  }
`;

export default notificationNewSubScription;
