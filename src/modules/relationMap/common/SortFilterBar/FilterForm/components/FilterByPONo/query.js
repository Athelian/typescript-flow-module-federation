import gql from 'graphql-tag';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: OrderFilterInput, $sort: OrderSortInput) {
    orders(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
        poNo
        issuedAt
        currency
      }
      page
      totalPage
    }
  }
`;

export default orderListQuery;
