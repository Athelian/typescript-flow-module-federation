// @flow
import * as React from 'react';

type Props = {
  id: string,
  PO: string,
};

function OrderItem({ id, PO, ...rest }: Props) {
  if (!id) return null;

  return (
    <React.Fragment>
      <h3> ID: {id} </h3>
      <p> PO: {PO} </p> {JSON.stringify(rest, null, 2)}
    </React.Fragment>
  );
}

export default OrderItem;
