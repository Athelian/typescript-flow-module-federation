// @flow
import React from 'react';
import { Query } from 'react-apollo';
import { Provider, Subscribe } from 'unstated';
import ActionDispatch from 'modules/relationMap/order/provider';
import { selectors } from 'modules/relationMap/order/store';
import LoadingIcon from 'components/LoadingIcon';
import { getByPathWithDefault, isNullOrUndefined } from 'utils/fp';
import TaskListInSlide from './components/TaskListInSlide';
import { editableTaskListQuery } from './query';
import RMTaskListContainer from './container';

const EditableTaskList = () => {
  const { state } = React.useContext(ActionDispatch);

  const uiSelectors = selectors(state);
  const orderIds = uiSelectors.targetedOrderIds();
  const batchIds = uiSelectors.targetedBatchIds();
  const shipmentIds = uiSelectors.targetedShipmentIds();

  return (
    <Provider>
      <Query
        query={editableTaskListQuery}
        variables={{
          orderIds,
          batchIds,
          shipmentIds,
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

          const orderTasks = getByPathWithDefault([], 'orders', data).flatMap(order =>
            getByPathWithDefault([], 'todo.tasks', order)
              .filter(({ id }) => !isNullOrUndefined(id))
              .map(task => ({
                ...task,
                entity: {
                  ...order,
                  __typename: 'Order',
                },
              }))
          );
          const batchTasks = getByPathWithDefault([], 'batches', data).flatMap(batch =>
            getByPathWithDefault([], 'todo.tasks', batch)
              .filter(({ id }) => !isNullOrUndefined(id))
              .map(task => ({
                ...task,
                entity: {
                  ...batch,
                  __typename: 'Batch',
                },
              }))
          );
          const shipmentTasks = getByPathWithDefault([], 'shipments', data).flatMap(shipment =>
            getByPathWithDefault([], 'todo.tasks', shipment)
              .filter(({ id }) => !isNullOrUndefined(id))
              .map(task => ({
                ...task,
                entity: {
                  ...shipment,
                  __typename: 'Shipment',
                },
              }))
          );

          const tasks = [...orderTasks, ...batchTasks, ...shipmentTasks];

          return (
            <Subscribe to={[RMTaskListContainer]}>
              {({ initDetailValues }) => (
                <TaskListInSlide tasks={tasks} initDetailValues={initDetailValues} />
              )}
            </Subscribe>
          );
        }}
      </Query>
    </Provider>
  );
};

export default EditableTaskList;
