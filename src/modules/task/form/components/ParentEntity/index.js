// @flow

import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { OrderInfoContainer } from 'modules/order/form/containers';
import TaskContainer from 'modules/task/form/container';
import OrderValueSpy from './components/OrderValueSpy';

type Props = {
  inForm: boolean,
};

export default function ParentEntity({ inForm }: Props) {
  return (
    <Provider>
      <Subscribe to={[OrderInfoContainer, TaskContainer]}>
        {({ state }, { state: task, setFieldValue }) => (
          <OrderValueSpy inForm={inForm} setTaskValue={setFieldValue} task={task} values={state} />
        )}
      </Subscribe>
    </Provider>
  );
}
