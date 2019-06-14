// @flow
import React from 'react';
import { Query } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors } from 'modules/relationMap/order/store';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import TableInlineEdit from './index.table';
import { editTableViewQuery } from './query';
import { findAllPossibleIds, findOrderAndShipmentIds } from './helpers';
import normalize from './normalize';

type Props = {
  onCancel: Function,
  entities: {
    orders: Object,
    orderItems: Object,
    batches: Object,
    shipments: Object,
    exporters: Object,
  },
};

const TableView = (props: Props) => {
  const { onCancel, entities: sourceEntities } = props;
  const [isReady, setIsReady] = React.useState(false);
  const { state } = React.useContext(ActionDispatch);
  const uiSelectors = selectors(state);
  const shipmentIds = uiSelectors.targetedShipmentIds();
  const batchIds = uiSelectors.targetedBatchIds();
  const orderItemIds = uiSelectors.targetedOrderItemIds();
  const orderIds = uiSelectors.targetedOrderIds();

  const orderIdsQuery = [...orderIds];
  const shipmentIdsQuery = [...shipmentIds];

  orderIds.forEach(selectedId => {
    const { orders, shipments } = findOrderAndShipmentIds(
      {
        type: 'order',
        selectedId,
      },
      sourceEntities
    );
    orderIdsQuery.push(...orders);
    shipmentIdsQuery.push(...shipments);
  });

  shipmentIds.forEach(selectedId => {
    const { orders, shipments } = findOrderAndShipmentIds(
      {
        type: 'shipment',
        selectedId,
      },
      sourceEntities
    );
    orderIdsQuery.push(...orders);
    shipmentIdsQuery.push(...shipments);
  });

  orderItemIds.forEach(selectedId => {
    const { orders, shipments } = findOrderAndShipmentIds(
      {
        type: 'orderItem',
        selectedId,
      },
      sourceEntities
    );
    orderIdsQuery.push(...orders);
    shipmentIdsQuery.push(...shipments);
  });

  batchIds.forEach(selectedId => {
    const { orders, shipments } = findOrderAndShipmentIds(
      {
        type: 'batch',
        selectedId,
      },
      sourceEntities
    );
    orderIdsQuery.push(...orders);
    shipmentIdsQuery.push(...shipments);
  });

  return (
    <Query
      query={editTableViewQuery}
      variables={{
        shipmentIds: [...new Set(shipmentIdsQuery)],
        orderIds: [...new Set(orderIdsQuery)],
      }}
      fetchPolicy="cache-first"
      onCompleted={() => {
        if (!isReady) {
          setIsReady(true);
        }
      }}
      onError={logger.error}
    >
      {({ data, error, loading }) => {
        if (error) {
          return error.message;
        }
        if (loading) {
          return <LoadingIcon />;
        }

        const orders = getByPathWithDefault([], 'ordersByIDs', data);
        const shipments = getByPathWithDefault([], 'shipmentsByIDs', data);

        const { entities } = normalize({ orders, shipments });
        const allId = findAllPossibleIds(
          {
            shipmentIds,
            batchIds,
            orderItemIds,
            orderIds,
          },
          entities
        );

        return (
          <TableInlineEdit
            orders={orders}
            shipments={shipments}
            allId={allId}
            targetIds={{
              shipmentIds,
              batchIds,
              orderItemIds,
              orderIds,
            }}
            onCancel={onCancel}
          />
        );
      }}
    </Query>
  );
};

export default TableView;
