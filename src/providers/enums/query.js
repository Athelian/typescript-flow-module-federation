// @flow
import gql from 'graphql-tag';

const enumsQuery = gql`
  query {
    Currency: __type(name: "Currency") {
      enumValues {
        name
        description
      }
    }

    Incoterm: __type(name: "Incoterm") {
      enumValues {
        name
        description
      }
    }

    LoadType: __type(name: "LoadType") {
      enumValues {
        name
        description
      }
    }

    TransportType: __type(name: "TransportType") {
      enumValues {
        name
        description
      }
    }
  }
`;

export default enumsQuery;
