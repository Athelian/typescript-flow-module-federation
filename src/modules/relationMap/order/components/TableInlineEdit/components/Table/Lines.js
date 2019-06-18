// @flow
import * as React from 'react';
import { range } from 'lodash';
import { totalLinePerOrder } from 'modules/relationMap/order/components/TableInlineEdit/helpers';
import LineNumber from '../LineNumber';
import { SidebarWrapperStyle } from './style';

type Props = {
  orderIds: Array<string>,
  batchIds: Array<string>,
  orderItemIds: Array<string>,
  mappingObjects: Object,
  innerRef: React.Ref<any>,
};

export const Lines = ({ innerRef, mappingObjects, orderIds, batchIds, orderItemIds }: Props) => {
  const shipmentLines = Object.entries(mappingObjects.shipmentNoRelation || {}).length;
  return (
    <div className={SidebarWrapperStyle} ref={innerRef}>
      {range(0, shipmentLines).map(counter => (
        <LineNumber height="40px" line={counter + 1} key={`line-for-${counter}`} />
      ))}
      {/* Row for each order */}
      {orderIds.map((orderId, counter) => {
        const order = mappingObjects.order[orderId];
        if (!order) return null;
        const orderItems = (Object.values(mappingObjects.orderItem || {}): any).filter(
          item => order.relation.orderItem[item.data.id] && orderItemIds.includes(item.data.id)
        );
        const totalLines = totalLinePerOrder(orderItems, batchIds);
        return (
          <LineNumber
            height={`${totalLines * 40}px`}
            line={shipmentLines + counter + 1}
            key={`line-for-${orderId}`}
          />
        );
      })}
    </div>
  );
};

export default Lines;
