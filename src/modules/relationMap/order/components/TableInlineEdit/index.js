// @flow
import React from 'react';
import { Query } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors } from 'modules/relationMap/order/store';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import TableInlineEdit from './index.table';
import { findAllPossibleIds } from './helpers';
import { findIdsQuery, editTableViewQuery } from './query';
import normalize from './normalize';

type Props = {
  onCancel: Function,
};
const TableView = (props: Props) => {
  const { onCancel } = props;
  const { state } = React.useContext(ActionDispatch);
  const uiSelectors = selectors(state);
  const shipmentIds = uiSelectors.targetedShipmentIds();
  const batchIds = uiSelectors.targetedBatchIds();
  const orderItemIds = uiSelectors.targetedOrderItemIds();
  const orderIds = uiSelectors.targetedOrderIds();

  return (
    <Query
      query={findIdsQuery}
      variables={{
        orderIds,
        shipmentIds,
        batchIds,
        orderItemIds,
      }}
      fetchPolicy="network-only"
      onCompleted={logger.warn}
      onError={logger.error}
    >
      {({ data, error, loading }) => {
        if (error) {
          return error.message;
        }
        if (loading) {
          return <LoadingIcon />;
        }
        // find all possible ids base on target entities
        const { entities } = normalize({
          orders: getByPathWithDefault([], 'ordersByIDs', data),
          orderItems: getByPathWithDefault([], 'orderItemsByIDs', data),
          batches: getByPathWithDefault([], 'batchesByIDs', data),
          shipments: getByPathWithDefault([], 'shipmentsByIDs', data),
        });

        const allId = findAllPossibleIds(state.targets, entities);
        return (
          <Query
            query={editTableViewQuery}
            variables={allId}
            fetchPolicy="network-only"
            onCompleted={logger.warn}
            onError={logger.error}
          >
            {({ data: fullData, error: fetchError, loading: isLoading }) => {
              if (fetchError) {
                return fetchError.message;
              }
              if (isLoading) {
                return <LoadingIcon />;
              }
              // render the table with orders and shipments base on the ids
              return (
                <TableInlineEdit
                  orders={getByPathWithDefault([], 'ordersByIDs', fullData)}
                  shipments={getByPathWithDefault([], 'shipmentsByIDs', fullData)}
                  allId={allId}
                  onCancel={onCancel}
                />
              );
            }}
          </Query>
        );
      }}
    </Query>
  );
};

export default TableView;
