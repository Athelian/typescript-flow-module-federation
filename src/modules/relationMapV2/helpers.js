// @flow
import { findKey } from 'lodash/fp';
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from './constants';
import type { Entity } from './type.js.flow';

const DELAY = 200; // 0.2 second
const timer = {};
const isTimeoutRunning = {};

export const findOrderIdByBatch = (batchId: string, entities: Object) => {
  const parentOrderId = findKey(currentOrder => {
    return (currentOrder.orderItems || []).some(itemId =>
      getByPathWithDefault([], `orderItems.${itemId}.batches`, entities).includes(batchId)
    );
  }, entities.orders);
  return parentOrderId;
};

export const findItemIdByBatch = (batchId: string, entities: Object) => {
  const parentIemId = findKey(currentItem => {
    return (currentItem.batches || []).includes(batchId);
  }, entities.orderItems);
  return parentIemId;
};

export const findOrderIdByOrderItem = (itemId: string, entities: Object) => {
  const parentOrderId = findKey(currentOrder => {
    return (currentOrder.orderItems || []).includes(itemId);
  }, entities.orders);
  return parentOrderId;
};

export const findOrderIdsByContainer = (containerId: string, entities: Object) => {
  const parentOrderIds = (Object.keys(entities.orders || {}).filter(orderId => {
    return (entities?.orders?.[orderId]?.orderItems ?? []).some(itemId =>
      (entities?.orderItems?.[itemId]?.batches ?? []).some(
        batchId => entities?.batches?.[batchId]?.container === containerId
      )
    );
  }): Array<string>);
  return parentOrderIds;
};

export const findShipmentIdByContainer = (containerId: string, entities: Object) => {
  const parentIds = (Object.keys(entities.containers || {})
    .filter(id => {
      return containerId === id;
    })
    .map(id => entities.containers?.[id]?.shipment): Array<string>);
  const [shipmentId] = parentIds || [];
  return shipmentId;
};

export const findShipmentIdsByBatch = (batchId: string, entities: Object) => {
  const parentIds = (Object.keys(entities.batches || {})
    .filter(id => {
      return batchId === id;
    })
    .map(id => entities.batches?.[id]?.shipment): Array<string>);
  return [...new Set(parentIds)];
};

export const findShipmentIdsByOrderItem = (itemId: string, entities: Object) => {
  const parentIds = (Object.keys(entities.batches || {})
    .filter(id => {
      return entities.batches?.[id]?.orderItem === itemId;
    })
    .map(id => entities.batches?.[id]?.shipment): Array<string>);
  return [...new Set(parentIds)];
};

export const findShipmentIdsByOrder = (orderId: string, entities: Object) => {
  const parentIds = (Object.keys(entities.batches || {})
    .filter(id => {
      return (
        entities.batches?.[id]?.orderItem &&
        entities.orderItems?.[entities.batches?.[id]?.orderItem]?.order === orderId
      );
    })
    .map(id => entities.batches?.[id]?.shipment): Array<string>);
  return [...new Set(parentIds)];
};

export const findOrderIdsByShipment = (shipmentId: string, entities: Object) => {
  const parentOrderIds = (Object.keys(entities.orders || {}).filter(orderId => {
    return (entities?.orders?.[orderId]?.orderItems ?? []).some(itemId =>
      (entities?.orderItems?.[itemId]?.batches ?? []).some(
        batchId => entities?.batches?.[batchId]?.shipment === shipmentId
      )
    );
  }): Array<string>);
  return parentOrderIds;
};

export const targetedIds = (
  targets: Array<string>,
  type: typeof ORDER | typeof ORDER_ITEM | typeof BATCH | typeof CONTAINER | typeof SHIPMENT
) => {
  const ids = targets.filter(item => item.includes(`${type}-`));
  return (ids.map(orderItem => {
    const [, id] = orderItem.split('-');
    return id;
  }): Array<string>);
};

export const handleClickAndDoubleClick = ({
  clickId,
  onClick,
  onDoubleClick,
  onCtrlClick,
}: {|
  clickId: string,
  onClick: Function,
  onDoubleClick: Function,
  onCtrlClick?: Function,
|}) => {
  const handleClick = (evt: SyntheticMouseEvent<any>) => {
    evt.persist();
    if (isTimeoutRunning[clickId]) {
      onDoubleClick();
      clearTimeout(timer[clickId]);
      isTimeoutRunning[clickId] = false;
    } else {
      if (evt.metaKey || evt.ctrlKey) {
        const fn = onCtrlClick || onClick;
        fn();
      } else {
        onClick();
      }
      isTimeoutRunning[clickId] = true;
      timer[clickId] = setTimeout(() => {
        isTimeoutRunning[clickId] = false;
      }, DELAY);
    }
  };

  return handleClick;
};

export const getColorByEntity = (entity: ?Entity) => {
  switch (entity) {
    case ORDER_ITEM:
      return 'ORDER_ITEM';
    default:
      return entity && entity.toUpperCase();
  }
};
export const getIconByEntity = (entity: ?Entity) => {
  switch (entity) {
    case ORDER_ITEM:
      return 'ORDER_ITEM';
    default:
      return entity && entity.toUpperCase();
  }
};
