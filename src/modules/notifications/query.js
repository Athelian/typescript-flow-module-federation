// @flow
import gql from 'graphql-tag';

export const notificationListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    viewer {
      notifications(page: $page, perPage: $perPage) {
        nodes {
          id
        }
        page
        totalPage
      }
    }
  }
`;

export default notificationListQuery;
