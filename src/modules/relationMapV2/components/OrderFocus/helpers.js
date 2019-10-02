// @flow
import * as React from 'react';
import { colors, borderRadiuses } from 'styles/common';
import type { BatchPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import styled from 'react-emotion';
import { findKey } from 'lodash/fp';
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { ClientSorts, Entities } from 'modules/relationMapV2/store';
import type { CellRender, Entity } from './type.js.flow';

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

export const OrderCard = styled.div`
  width: 285px;
  height: 55px;
`;
export const ItemCard = styled.div`
  width: 465px;
  height: 55px;
`;
export const BatchHeaderCard = styled.div`
  width: 445px;
  height: 55px;
`;
export const BatchCard = styled.div`
  width: 445px;
  height: 55px;
`;
export const ContainerCard = styled.div`
  width: 375px;
  height: 55px;
`;
export const ShipmentCard = styled.div`
  width: 515px;
  height: 55px;
`;
export const HeaderCard = styled.div`
  position: relative;
  ${borderRadiuses.MAIN};
  background: ${props => (props.isExpand ? colors.GRAY_VERY_LIGHT : colors.WHITE)};
  border: 4px solid ${props => (props.selected ? colors.TEAL : colors.TRANSPARENT)};
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  &:hover {
    cursor: pointer;
  }
`;

function orderCell({
  itemPosition,
  batchPosition,
  order,
  totalItems,
}: {|
  itemPosition: number,
  batchPosition: number,
  order: mixed,
  totalItems: number,
|}) {
  if (itemPosition === 0 && batchPosition === 0)
    return {
      type: ORDER,
      data: order,
      afterConnector: 'HORIZONTAL',
    };
  const isTheLastItemWithFirstBatch = itemPosition === totalItems - 1 && batchPosition === 0;
  const isNotTheLastItem = itemPosition < totalItems - 1 && totalItems > 1;
  if (isTheLastItemWithFirstBatch || isNotTheLastItem)
    return {
      type: 'duplicateOrder',
      data: {
        order,
        itemPosition,
        batchPosition,
      },
      afterConnector: 'VERTICAL',
    };
  return null;
}

function containerCell(batch: BatchPayload): ?CellRender {
  if (getByPathWithDefault(null, 'container', batch)) {
    return {
      beforeConnector: 'HORIZONTAL',
      type: CONTAINER,
      data: {
        ...getByPathWithDefault({}, 'container', batch),
        relatedBatch: batch,
      },
      afterConnector: 'HORIZONTAL',
    };
  }
  if (
    getByPathWithDefault(null, 'shipment', batch) &&
    !getByPathWithDefault(null, 'container', batch)
  ) {
    return {
      beforeConnector: 'HORIZONTAL',
      type: 'shipmentWithoutContainer',
      data: {
        relatedBatch: batch,
      },
      afterConnector: 'HORIZONTAL',
    };
  }
  return null;
}

export const orderCoordinates = memoize(
  ({
    isExpand,
    isLoadedData,
    order,
  }: {
    isExpand: boolean,
    order: Object,
    isLoadedData?: boolean,
  }): Array<?CellRender> => {
    const { getItemsSortByOrderId, getBatchesSortByItemId } = ClientSorts.useContainer();
    const { getRelatedBy } = Entities.useContainer();
    const orderItems = order?.orderItems ?? [];
    const orderItemCount = order?.orderItemCount ?? 0;
    const orderItemChildlessCount = order?.orderItemChildlessCount ?? 0;
    const batchCount = order?.batchCount ?? 0;
    const containerCount = order?.containerCount ?? 0;
    const shipmentCount = order?.shipmentCount ?? 0;
    if (!isExpand) {
      return orderItemCount > 0
        ? [
            {
              type: ORDER,
              data: order,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'itemSummary',
              data: order,
              ...(batchCount ? { afterConnector: 'HORIZONTAL' } : {}),
            },
            {
              ...(batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'batchSummary',
              data: order,
              ...(containerCount || shipmentCount ? { afterConnector: 'HORIZONTAL' } : {}),
            },
            {
              ...(shipmentCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'containerSummary',
              data: order,
              ...(shipmentCount ? { afterConnector: 'HORIZONTAL' } : {}),
            },
            {
              ...(shipmentCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'shipmentSummary',
              data: order,
            },
          ]
        : [
            {
              type: ORDER,
              data: order,
            },
            null,
            null,
            null,
            null,
          ];
    }
    const result = [
      null,
      {
        type: 'itemSummary',
        data: order,
      },
      {
        type: 'batchSummary',
        data: order,
      },
      containerCount
        ? {
            type: 'containerSummary',
            data: order,
          }
        : {
            type: 'containerSummary',
            data: null,
          },
      {
        type: 'shipmentSummary',
        data: order,
      },
    ];
    if (!isLoadedData) {
      // calculate the total base on container count
      for (let index = 0; index < orderItemChildlessCount + batchCount; index += 1) {
        result.push(
          ...[
            index > 0
              ? null
              : {
                  type: ORDER,
                  data: order,
                  afterConnector: 'HORIZONTAL',
                },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'placeholder',
              entity: ORDER_ITEM,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'placeholder',
              entity: BATCH,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'placeholder',
              entity: CONTAINER,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'placeholder',
              entity: SHIPMENT,
              afterConnector: 'HORIZONTAL',
            },
          ]
        );
      }
      return result;
    }
    if (orderItemCount > 0) {
      const itemsList = [];
      const processItemsId = [];
      const orderItemSorted = getItemsSortByOrderId(order.id, orderItems);
      orderItemSorted.forEach(itemId => {
        if (!processItemsId.includes(itemId)) {
          const item = orderItems.find(orderItem => orderItem?.id === itemId);
          if (item) {
            processItemsId.push(itemId);
            itemsList.push(item);
            const relatedItems = getRelatedBy('orderItem', item.id);
            relatedItems
              .filter(id => !processItemsId.includes(id))
              .forEach(relateId => {
                const relatedItem = orderItems.find(orderItem => orderItem?.id === relateId);
                if (relatedItem) {
                  itemsList.push(relatedItem);
                  processItemsId.push(relatedItem.id);
                }
              });
          }
        }
      });
      orderItems
        .filter(item => !processItemsId.includes(item?.id))
        .forEach(item => itemsList.push(item));

      itemsList.forEach((item, index) => {
        const batches = item?.batches ?? [];
        if (batches.length) {
          const batchesList = [];
          const processBatchesId = [];
          const batchesSorted = getBatchesSortByItemId(item.id, batches);
          batchesSorted.forEach(batchId => {
            if (!processBatchesId.includes(batchId)) {
              const batch = batches.find(batchItem => batchItem?.id === batchId);
              if (batch) {
                batchesList.push(batch);
                processBatchesId.push(batch.id);
                const relatedBatches = getRelatedBy('batch', batch.id);
                relatedBatches
                  .filter(id => !batchesSorted.includes(id))
                  .forEach(relateId => {
                    const relatedBatch = batches.find(batchItem => batchItem?.id === relateId);
                    if (relatedBatch) {
                      batchesList.push(relatedBatch);
                      processBatchesId.push(relatedBatch.id);
                    }
                  });
              }
            }
          });
          batches
            .filter(batch => !processBatchesId.includes(batch?.id))
            .forEach(batch => batchesList.push(batch));

          batchesList.forEach((batch, position) => {
            result.push(
              ...[
                orderCell({
                  order,
                  itemPosition: index,
                  batchPosition: position,
                  totalItems: orderItems.length,
                }),
                !position
                  ? {
                      beforeConnector: 'HORIZONTAL',
                      type: ORDER_ITEM,
                      data: item,
                      afterConnector: 'HORIZONTAL',
                    }
                  : {
                      type: 'duplicateOrderItem',
                      data: {
                        order,
                        item,
                        batch,
                        batchPosition: position,
                      },
                      afterConnector: 'VERTICAL',
                    },
                {
                  beforeConnector: 'HORIZONTAL',
                  type: BATCH,
                  data: batch,
                  afterConnector:
                    batch && (batch.container || batch.shipment) ? 'HORIZONTAL' : null,
                },
                containerCell(batch),
                batch && batch.shipment
                  ? {
                      beforeConnector: 'HORIZONTAL',
                      type: SHIPMENT,
                      data: {
                        ...batch.shipment,
                        relatedBatch: batch,
                      },
                    }
                  : null,
              ]
            );
          });
        } else {
          // order item has no batches
          result.push(
            ...[
              index === 0
                ? {
                    type: ORDER,
                    data: order,
                    afterConnector: 'HORIZONTAL',
                  }
                : {
                    type: 'duplicateOrder',
                    data: {
                      order,
                      itemPosition: index,
                    },
                    afterConnector: 'VERTICAL',
                  },
              {
                beforeConnector: 'HORIZONTAL',
                type: ORDER_ITEM,
                data: item,
              },
              null,
              null,
              null,
            ]
          );
        }
      });
    } else {
      // order which has no item
      result.push(
        ...[
          {
            type: ORDER,
            data: order,
          },
          null,
          null,
          null,
          null,
        ]
      );
    }
    return result;
  }
);

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

export const getCardByEntity = (entity: ?Entity) => {
  switch (entity) {
    case ORDER:
      return OrderCard;
    case ORDER_ITEM:
      return ItemCard;
    case BATCH:
      return BatchCard;
    case CONTAINER:
      return ContainerCard;
    case SHIPMENT:
      return ShipmentCard;
    default:
      return React.Fragment;
  }
};
