// @flow
import React from 'react';
import { Query } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { getByPathWithDefault } from 'utils/fp';
import TableInlineEdit from './index.table';
import { findAllPossibleIds } from './helpers';
import { orderListQuery } from './query';

type Props = {
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    shipments: Object,
  },
};
const TableView = (props: Props) => {
  const { entities } = props;
  const { state } = React.useContext(ActionDispatch);
  const allId = findAllPossibleIds(state.targets, entities);
  const { orderIds } = allId;
  return (
    <Query
      query={orderListQuery}
      variables={{
        page: 1,
        perPage: orderIds.length,
        filterBy: {
          ids: orderIds,
        },
        sortBy: {
          updatedAt: 'DESCENDING',
        },
      }}
      fetchPolicy="network-only"
    >
      {({ data, error, loading }) => {
        if (error) {
          return error.message;
        }
        if (loading) {
          return <LoadingIcon />;
        }
        return (
          <TableInlineEdit
            data={getByPathWithDefault([], 'orders.nodes', data)}
            allId={allId}
            onCancel={() => {}}
          />
        );
      }}
    </Query>
  );
};

export default TableView;
