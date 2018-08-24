import gql from 'graphql-tag';

export const orderListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    orders(page: $page, perPage: $perPage) {
      nodes {
        id
        poNo
        issuedAt
        exporter {
          id
          name
        }
        updatedAt
        createdAt
        orderItems {
          id
          quantity
          productProvider {
            id
            supplier {
              id
              name
            }
            product {
              id
              name
              serial
            }
          }
        }
      }
      page
      totalPage
    }
  }
`;

export default orderListQuery;
