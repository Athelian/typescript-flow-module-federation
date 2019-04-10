// @flow

import * as React from 'react';
import { Provider, Subscribe } from 'unstated';
import { OrderInfoContainer } from 'modules/order/form/containers';
import OrderValueSpy from './components/OrderValueSpy';

export default function ParentEntity() {
  return (
    <Provider>
      <Subscribe to={[OrderInfoContainer]}>
        {({ state }) => <OrderValueSpy values={state} />}
      </Subscribe>
    </Provider>
  );
}
