// @flow
import React from 'react';
import { Query } from 'react-apollo';
import LoadingIcon from 'components/LoadingIcon';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors } from 'modules/relationMap/order/store';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import TableInlineEdit from './index.table';
import { orderShipmentTableQuery } from './query';
import normalize from './normalize';

function getEntityByType(data: Object, entity: string) {
  return getByPathWithDefault([], 'orderShipmentTable', data).filter(
    ({ __typename: type }) => type === entity
  );
}

const TableView = () => {
  const [isReady, setIsReady] = React.useState(false);
  const { state } = React.useContext(ActionDispatch);
  const uiSelectors = selectors(state);
  const shipmentIds = uiSelectors.targetedShipmentIds();
  const batchIds = uiSelectors.targetedBatchIds();
  const orderItemIds = uiSelectors.targetedOrderItemIds();
  const orderIds = uiSelectors.targetedOrderIds();

  return (
    <Query
      query={orderShipmentTableQuery}
      variables={{
        entities: [
          ...shipmentIds.map(shipmentId => ({
            shipmentId,
          })),
          ...orderIds.map(orderId => ({
            orderId,
          })),
          ...batchIds.map(batchId => ({
            batchId,
          })),
          ...orderItemIds.map(orderItemId => ({
            orderItemId,
          })),
        ],
      }}
      fetchPolicy="network-only"
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

        const orders = getEntityByType(data, 'Order');
        const shipments = getEntityByType(data, 'Shipment');
        const orderItems = getEntityByType(data, 'OrderItem');
        const batches = getEntityByType(data, 'Batch');
        const containers = getEntityByType(data, 'Container');

        const { entities } = normalize({
          orders,
          shipments,
          containers,
          orderItems,
          batches,
        });

        return (
          <TableInlineEdit
            orders={orders}
            shipments={shipments}
            allId={{
              orderIds: Object.keys(entities.orders || {}),
              orderItemIds: Object.keys(entities.orderItems || {}),
              batchIds: Object.keys(entities.batches || {}),
              shipmentIds: Object.keys(entities.shipments || {}),
              productIds: Object.keys(entities.products || {}),
              containerIds: Object.keys(entities.containers || {}),
            }}
            entities={entities}
            targetIds={{
              shipmentIds,
              batchIds,
              orderItemIds,
              orderIds,
            }}
          />
        );
      }}
    </Query>
  );
};

export default TableView;
