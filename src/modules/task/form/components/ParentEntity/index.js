// @flow

import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { OrderInfoContainer } from 'modules/order/form/containers';
import { BatchInfoContainer } from 'modules/batch/form/containers';
import { ShipmentInfoContainer, ShipmentTimelineContainer } from 'modules/shipment/form/containers';
import TaskContainer from 'modules/task/form/container';
import OrderValueSpy from './components/OrderValueSpy';
import BatchValueSpy from './components/BatchValueSpy';
import ShipmentValueSpy from './components/ShipmentValueSpy';

type Props = {
  inForm: boolean,
};

export default function ParentEntity({ inForm }: Props) {
  return (
    <Provider>
      <>
        <Subscribe to={[OrderInfoContainer, TaskContainer]}>
          {({ state }, { state: task, setFieldValue }) => (
            <OrderValueSpy
              inForm={inForm}
              setTaskValue={setFieldValue}
              task={task}
              values={state}
            />
          )}
        </Subscribe>
        <Subscribe to={[BatchInfoContainer, TaskContainer]}>
          {({ state }, { state: task, setFieldValue }) => (
            <BatchValueSpy
              inForm={inForm}
              setTaskValue={setFieldValue}
              task={task}
              values={state}
            />
          )}
        </Subscribe>
        <Subscribe to={[ShipmentInfoContainer, ShipmentTimelineContainer, TaskContainer]}>
          {({ state: info }, { state: timeline }, { state: task, setFieldValue }) => (
            <ShipmentValueSpy
              inForm={inForm}
              setTaskValue={setFieldValue}
              task={task}
              values={{ ...info, ...timeline }}
            />
          )}
        </Subscribe>
      </>
    </Provider>
  );
}
