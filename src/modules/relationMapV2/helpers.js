// @flow
import { findKey, get, set, uniq } from 'lodash/fp';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT, PRODUCT, TAG } from './constants';
import type { Entity } from './type.js.flow';

const DELAY = 200; // 0.2 second
const timer = {};
const isTimeoutRunning = {};

export const loadMore = (
  selectedField: string,
  clientData: {| fetchMore: Function, data: ?Object, onSuccess: Function |},
  queryVariables: Object = {}
) => {
  const {
    data = { [`${selectedField}`]: { page: 1, totalPage: 0 } },
    fetchMore,
    onSuccess,
  } = clientData;
  if (!data) return Promise.resolve({});
  const nextPage = get(`${selectedField}.page`, data) + 1;
  const totalPage = get(`${selectedField}.totalPage`, data);
  if (nextPage > totalPage) return Promise.resolve({});
  logger.warn('loadMore nextPage', nextPage);
  return fetchMore({
    variables: {
      ...queryVariables,
      filter: queryVariables.filter,
      ...(queryVariables && queryVariables.sort
        ? { sort: { [queryVariables.sort.field]: queryVariables.sort.direction } }
        : {}),
      page: nextPage,
    },
    updateQuery: (prevResult, { fetchMoreResult }) => {
      logger.warn('updateQuery');
      onSuccess(fetchMoreResult);

      if (
        get(`${selectedField}.page`, prevResult) + 1 !==
        get(`${selectedField}.page`, fetchMoreResult)
      ) {
        return prevResult;
      }

      if (get(`${selectedField}.nodes`, fetchMoreResult).length === 0) return prevResult;

      const result = set(
        `${selectedField}.hits`,
        uniq([
          ...get(`${selectedField}.hits`, prevResult),
          ...get(`${selectedField}.hits`, fetchMoreResult),
        ]),
        fetchMoreResult
      );

      return set(
        `${selectedField}.nodes`,
        uniq([
          ...get(`${selectedField}.nodes`, prevResult),
          ...get(`${selectedField}.nodes`, fetchMoreResult),
        ]),
        result
      );
    },
  }).catch(logger.error);
};

export function findParentIdsByBatch({
  viewer,
  batchId,
  entities,
}: {|
  viewer: typeof ORDER | typeof SHIPMENT,
  batchId: string,
  entities: Object,
|}): [?string, ?string] {
  if (viewer === ORDER) {
    const parentItemId = findKey(orderItem => {
      return (orderItem.batches || []).includes(batchId);
    }, entities.orderItems);

    const parentOrderId = findKey(currentOrder => {
      return (currentOrder.orderItems || []).includes(parentItemId);
    }, entities.orders);

    return [parentItemId, parentOrderId];
  }

  const parentItemId = entities.batches?.[batchId]?.orderItem;

  const parentOrderId = entities.orderItems?.[parentItemId]?.order;

  return [parentItemId, parentOrderId];
}

export function findOrderIdByItem({
  viewer,
  orderItemId,
  entities,
}: {|
  viewer: typeof ORDER | typeof SHIPMENT,
  orderItemId: string,
  entities: Object,
|}): ?string {
  if (viewer === ORDER) {
    const parentOrderId = findKey(currentOrder => {
      return (currentOrder.orderItems || []).includes(orderItemId);
    }, entities.orders);

    return parentOrderId;
  }

  const parentOrderId = entities.orderItems?.[orderItemId]?.order;

  return parentOrderId;
}

export function findOrderIdsByContainer({
  viewer,
  containerId,
  entities,
}: {|
  viewer: typeof ORDER | typeof SHIPMENT,
  containerId: string,
  entities: Object,
|}): Array<string> {
  if (viewer === ORDER) {
    return (Object.keys(entities.orders || {}).filter(orderId => {
      return (entities?.orders?.[orderId]?.orderItems ?? []).some(itemId =>
        (entities?.orderItems?.[itemId]?.batches ?? []).some(
          batchId => entities?.batches?.[batchId]?.container === containerId
        )
      );
    }): Array<string>);
  }

  const parentOrderIds = (Object.keys(entities.batches || {})
    .filter(batchId => {
      return entities?.batches?.[batchId]?.container === containerId;
    })
    .map(batchId => {
      const parentItemId = entities.batches?.[batchId]?.orderItem;
      return entities.orderItems?.[parentItemId]?.order;
    }): Array<string>);

  return [...new Set(parentOrderIds)];
}

export const findOrderIdsByShipment = ({
  viewer,
  shipmentId,
  entities,
}: {|
  viewer: typeof ORDER | typeof SHIPMENT,
  shipmentId: string,
  entities: Object,
|}) => {
  if (viewer === ORDER) {
    const parentOrderIds = (Object.keys(entities.orders || {}).filter(orderId => {
      return (entities?.orders?.[orderId]?.orderItems ?? []).some(itemId =>
        (entities?.orderItems?.[itemId]?.batches ?? []).some(
          batchId => entities?.batches?.[batchId]?.shipment === shipmentId
        )
      );
    }): Array<string>);
    return [...new Set(parentOrderIds)];
  }

  const parentOrderIds = (Object.keys(entities.batches || {})
    .filter(batchId => {
      return entities?.batches?.[batchId]?.shipment === shipmentId;
    })
    .map(batchId => {
      const parentItemId = entities.batches?.[batchId]?.orderItem;
      return entities.orderItems?.[parentItemId]?.order;
    }): Array<string>);

  return [...new Set(parentOrderIds)];
};

// find shipment id will be called on shipment focused
export const findShipmentIdByContainer = (containerId: string, entities: Object) => {
  const parentIds = (Object.keys(entities.containers || {})
    .filter(id => {
      return containerId === id;
    })
    .map(id => entities.containers?.[id]?.shipment): Array<string>);
  const [shipmentId] = parentIds || [];
  return shipmentId;
};

export const findShipmentIdByBatch = (batchId: string, entities: Object) => {
  return entities.batches?.[batchId]?.shipment;
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

export const getIdentifier = ({
  id,
  type,
  entities,
}: {
  id: string,
  type: typeof ORDER | typeof BATCH | typeof ORDER_ITEM | typeof CONTAINER | typeof SHIPMENT,
  entities: Object,
}) => {
  switch (type) {
    case ORDER:
      return {
        id,
        icon: 'ORDER',
        value: getByPathWithDefault('', `orders.${id}.poNo`, entities),
      };
    case ORDER_ITEM:
      return {
        id,
        icon: 'ORDER_ITEM',
        value: getByPathWithDefault('', `orderItems.${id}.no`, entities),
      };
    case BATCH:
      return {
        id,
        icon: 'BATCH',
        value: getByPathWithDefault('', `batches.${id}.no`, entities),
      };
    case CONTAINER:
      return {
        id,
        icon: 'CONTAINER',
        value: getByPathWithDefault('', `containers.${id}.no`, entities),
      };
    case SHIPMENT:
      return {
        id,
        icon: 'SHIPMENT',
        value: getByPathWithDefault('', `shipments.${id}.blNo`, entities),
      };

    default:
      return {
        id,
        icon: 'ORDER',
        value: '',
      };
  }
};

export function isMatchedEntity(matches: Object, data: Object) {
  if (!matches?.entity || !data) return false;

  if (data.__typename === ORDER_ITEM) {
    return matches?.entity[`${data.productProvider?.product?.id}-${PRODUCT}`];
  }

  if (data.__typename === ORDER) {
    return (
      matches?.entity[`${data.id}-${data.__typename}`] ||
      (data?.tags ?? []).some(tag => matches?.entity[`${tag?.id}-${TAG}`])
    );
  }

  return matches?.entity[`${data.id}-${data.__typename}`];
}
