// @flow
import gql from 'graphql-tag';

export const reminderListQuery = gql`
  query reminderListQuery($page: Int!, $perPage: Int!, $filterBy:) {
  }
`;
