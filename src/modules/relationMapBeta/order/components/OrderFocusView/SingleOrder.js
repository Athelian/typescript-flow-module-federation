// @flow
import * as React from 'react';
import type { OrderFocusProps as Props } from 'modules/relationMapBeta/order/type.js.flow';
import Order from './Order';

export default function SingleOrder(props: Props) {
  return (
    <>
      <Order {...props} />
      <div />
      <div />
      <div />
      <div />
    </>
  );
}
