// @flow
import * as React from 'react';
import { colors, borderRadiuses } from 'styles/common';
import type { BatchPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import styled from 'react-emotion';
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import type { CellRender, Entity } from './type.js.flow';

const DELAY = 200; // 0.2 second
const timer = {};
const isTimeoutRunning = {};

export const handleClickAndDoubleClick = ({
  clickId,
  onClick,
  onDoubleClick,
}: {
  clickId: string,
  onClick: Function,
  onDoubleClick: Function,
}) => {
  const handleClick = () => {
    if (isTimeoutRunning[clickId]) {
      onDoubleClick();
      clearTimeout(timer[clickId]);
      isTimeoutRunning[clickId] = false;
    } else {
      onClick();
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
    order: mixed,
    isLoadedData?: boolean,
  }): Array<?CellRender> => {
    const orderItems = getByPathWithDefault([], 'orderItems', order);
    const orderItemCount = getByPathWithDefault(0, 'orderItemCount', order);
    const orderItemChildlessCount = getByPathWithDefault(0, 'orderItemChildlessCount', order);
    const batchCount = getByPathWithDefault(0, 'batchCount', order);
    const containerCount = getByPathWithDefault(0, 'containerCount', order);
    const shipmentCount = getByPathWithDefault(0, 'shipmentCount', order);
    // TODO: need to change the style for the summary row is closed to the next one
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
      orderItems.forEach((item, index) => {
        const batches = getByPathWithDefault([], 'batches', item);
        if (batches.length) {
          batches.forEach((batch, position) => {
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
                        itemPosition: index,
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
