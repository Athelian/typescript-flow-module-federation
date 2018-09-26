import gql from 'graphql-tag';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    orders(page: $page, perPage: $perPage) {
      nodes {
        id
      }
      page
      totalPage
    }
  }
`;
export const orderItemsQuery = gql`
  query($page: Int!, $perPage: Int!) {
    orderItems(page: $page, perPage: $perPage) {
      nodes {
        id
      }
      page
      totalPage
    }
  }
`;

export default orderListQuery;
