// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import query from './query';
import { useFilter } from '../hooks';

const Order = () => {
  const { filterAndSort } = useFilter({
    page: 1,
    perPage: 10,
    filter: {
      archived: false,
      shipmentArchived: false,
      batchArchived: false,
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
  });
  return (
    <Query query={query} variables={filterAndSort} fetchPolicy="network-only">
      {({ data }) => JSON.stringify(data, null, 2)}
    </Query>
  );
};

export default Order;
