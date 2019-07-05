// @flow

import * as React from 'react';
import { Location } from '@reach/router';
import { Provider, Subscribe } from 'unstated';
import { OrderInfoContainer } from 'modules/order/form/containers';
import { BatchInfoContainer } from 'modules/batch/form/containers';
import { ShipmentInfoContainer, ShipmentTimelineContainer } from 'modules/shipment/form/containers';
import TaskContainer from 'modules/task/form/container';
import OrderValueSpy from './components/OrderValueSpy';
import OrderItemValueSpy from './components/OrderItemValueSpy';
import BatchValueSpy from './components/BatchValueSpy';
import ShipmentValueSpy from './components/ShipmentValueSpy';
import ProductValueSpy from './components/ProductValueSpy';
import ProductProviderValueSpy from './components/ProductProviderValueSpy';

type Props = {|
  entity: Object,
  inParentEntityForm: boolean,
|};

export default function ParentEntity({ entity, inParentEntityForm }: Props) {
  return (
    <Location>
      {({ location }) => (
        <Provider>
          <>
            <Subscribe to={[OrderInfoContainer, TaskContainer]}>
              {({ state }, { state: task, setFieldValue }) => (
                <OrderValueSpy
                  inParentEntityForm={inParentEntityForm}
                  setTaskValue={setFieldValue}
                  task={task}
                  values={state}
                />
              )}
            </Subscribe>
            <Subscribe to={[OrderInfoContainer, TaskContainer]}>
              {({ state }, { state: task, setFieldValue }) => (
                <OrderItemValueSpy
                  entity={entity}
                  location={location}
                  setTaskValue={setFieldValue}
                  task={task}
                  values={state}
                />
              )}
            </Subscribe>
            <Subscribe to={[BatchInfoContainer, TaskContainer]}>
              {({ state }, { state: task, setFieldValue }) => (
                <BatchValueSpy
                  inParentEntityForm={inParentEntityForm}
                  setTaskValue={setFieldValue}
                  task={task}
                  values={state}
                />
              )}
            </Subscribe>
            <Subscribe to={[ShipmentInfoContainer, ShipmentTimelineContainer, TaskContainer]}>
              {({ state: info }, { state: timeline }, { state: task, setFieldValue }) => (
                <ShipmentValueSpy
                  inParentEntityForm={inParentEntityForm}
                  setTaskValue={setFieldValue}
                  task={task}
                  values={{ ...info, ...timeline }}
                />
              )}
            </Subscribe>
            <Subscribe to={[TaskContainer]}>
              {({ state: task, setFieldValue }) => (
                <ProductValueSpy
                  inParentEntityForm={inParentEntityForm}
                  setTaskValue={setFieldValue}
                  task={task}
                  values={{}}
                />
              )}
            </Subscribe>
            <Subscribe to={[TaskContainer]}>
              {({ state: task, setFieldValue }) => (
                <ProductProviderValueSpy
                  inParentEntityForm={inParentEntityForm}
                  setTaskValue={setFieldValue}
                  task={task}
                  values={{}}
                />
              )}
            </Subscribe>
          </>
        </Provider>
      )}
    </Location>
  );
}
