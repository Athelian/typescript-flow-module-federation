// @flow
import React from 'react';
import { Query } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import ActionDispatch from 'modules/relationMapBeta/order/provider';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import TableInlineEdit from './index.table';
import { findAllPossibleIds } from './helpers';
import { orderListQuery } from './query';

type Props = {
  onCancel: Function,
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    shipments: Object,
  },
};
const TableView = (props: Props) => {
  const { entities, onCancel } = props;
  const { state } = React.useContext(ActionDispatch);
  logger.warn('entities', entities);
  const allId = findAllPossibleIds(state.targets, entities);
  console.log('allId', allId);
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
            onCancel={onCancel}
          />
        );
      }}
    </Query>
  );
};

export default TableView;
