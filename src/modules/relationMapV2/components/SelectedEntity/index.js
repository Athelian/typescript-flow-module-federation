// @flow
import * as React from 'react';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { WrapperStyle } from './style';

type Props = {
  targets: Array<string>,
};

export default function SelectedEntity({ targets }: Props) {
  return (
    <div className={WrapperStyle}>
      <div>Orders: {targets.filter(item => item.includes(`${ORDER}-`)).length}</div>
      <div>Items: {targets.filter(item => item.includes(`${ORDER_ITEM}-`)).length}</div>
      <div>Batches: {targets.filter(item => item.includes(`${BATCH}-`)).length}</div>
      <div>Containers: {targets.filter(item => item.includes(`${CONTAINER}-`)).length}</div>
      <div>Shipments: {targets.filter(item => item.includes(`${SHIPMENT}-`)).length}</div>
    </div>
  );
}
