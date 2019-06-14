// @flow
import * as React from 'react';
import { totalLinePerOrder } from 'modules/relationMap/order/components/TableInlineEdit/helpers';
import LineNumber from '../LineNumber';
import { SidebarWrapperStyle } from './style';

type Props = {
  targetIds: Object,
  orderIds: Array<string>,
  batchIds: Array<string>,
  orderItemIds: Array<string>,
  mappingObjects: Object,
  innerRef: React.Ref<any>,
};

export const Lines = ({
  innerRef,
  mappingObjects,
  targetIds,
  orderIds,
  batchIds,
  orderItemIds,
}: Props) => {
  return (
    <div className={SidebarWrapperStyle} ref={innerRef}>
      {/* Add counter for shipment has no relation */}
      {(Object.entries(mappingObjects.shipmentNoRelation || {}): any).map(([shipmentId], idx) => (
        <LineNumber height="40px" line={idx + 1} key={`shipment-line-${shipmentId}`} />
      ))}
      {/* Add row for shipment has empty container */}
      {(Object.entries(mappingObjects.shipment || {}): any)
        .filter(([shipmentId]) => targetIds.shipmentIds.includes(shipmentId))
        .map(([shipmentId]) =>
          mappingObjects.shipment[shipmentId].data.containers
            .filter(item => item.batches.length === 0)
            .map((container, idx) => (
              <LineNumber
                height="40px"
                line={idx + 1 + Object.entries(mappingObjects.shipmentNoRelation || {}).length}
                key={`shipment-line-empty-container-${container.id}`}
              />
            ))
        )}
      {/* Row for each order */}
      {orderIds.map((orderId, counter) => {
        const order = mappingObjects.order[orderId];
        if (!order) return null;
        const orderItems = (Object.values(mappingObjects.orderItem || {}): any).filter(
          item => order.relation.orderItem[item.data.id] && orderItemIds.includes(item.data.id)
        );
        const totalLines = totalLinePerOrder(orderItems, batchIds);
        const shipmentLines =
          Object.entries(mappingObjects.shipmentNoRelation || {}).length +
          (Object.entries(mappingObjects.shipment || {}): any)
            .filter(([shipmentId]) => targetIds.shipmentIds.includes(shipmentId))
            .map(([shipmentId]) =>
              mappingObjects.shipment[shipmentId].data.containers.filter(
                item => item.batches.length === 0
              )
            )
            .reduce((total, currentContainer) => total + currentContainer.length, 0);

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
