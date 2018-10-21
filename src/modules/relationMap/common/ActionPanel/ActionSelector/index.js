// @flow
import * as React from 'react';
import * as style from '../style';

type Props = {
  children: React.Node,
  target: Object,
};

const ActionSelector = ({ children, target }: Props) => {
  const totalOrder = Object.keys(target.order || {}).length;
  const totalOrderItem = Object.keys(target.orderItem || {}).length;
  const totalBatch = Object.keys(target.batch || {}).length;
  const totalShipment = Object.keys(target.shipment || {}).length;
  return (
    <div className={style.ActionSection1WrapperStyle}>
      <div className={style.ActionsSelectedStyle}>
        <div>SELECTED</div>
        <div>
          {!!totalOrder && ` ${totalOrder} ORDERS `}
          {!!totalOrderItem && ` ${totalOrderItem} ORDER ITEMS `}
          {!!totalBatch && ` ${totalBatch} BATCHES `}
          {!!totalShipment && ` ${totalShipment} SHIPMENTS `}
        </div>
      </div>
      <div className={style.ChildrenWrapperStyle}>{children}</div>
    </div>
  );
};

export default ActionSelector;
