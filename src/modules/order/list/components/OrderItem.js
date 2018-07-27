// @flow
import * as React from 'react';

type Props = {
  id: string,
  PO: string,
};

function OrderItem({ id, PO, ...rest }: Props) {
  return (
    <div style={{ border: '1px solid green' }}>
      <h3> ID: {id} </h3>
      <p> PO: {PO} </p> {JSON.stringify(rest, null, 2)}
    </div>
  );
}

export default OrderItem;
