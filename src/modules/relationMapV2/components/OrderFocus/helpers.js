// @flow
import * as React from 'react';
import type { OrderPayload, BatchPayload } from 'generated/graphql';
import { flatten } from 'lodash';
import memoize from 'memoize-one';
import styled from 'react-emotion';
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import type { State, CellRender, Entity } from './type.js.flow';

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

function orderCell({
  itemPosition,
  batchPosition,
  order,
  totalItems,
}: {
  itemPosition: number,
  batchPosition: number,
  order: mixed,
  totalItems: number,
}) {
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
      result.push(
        ...[
          {
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

export const findLineColors = ({
  type,
  state,
  order,
  cell,
  position,
  isExpand,
}: {|
  position: 'before' | 'center' | 'after',
  type: string,
  isExpand: boolean,
  state: State,
  cell: CellRender,
  order?: OrderPayload,
|}) => {
  switch (type) {
    case ORDER: {
      const orderId = getByPathWithDefault('', 'data.id', cell);
      const orderItemIds = flatten(
        getByPathWithDefault([], 'data.orderItems', cell).map(item =>
          getByPathWithDefault('', 'id', item)
        )
      );
      const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
      const isTargetedAnyItems = orderItemIds.some(itemId =>
        state.targets.includes(`${ORDER_ITEM}-${itemId}`)
      );

      return {
        isTargeted: isTargetedOrder && isTargetedAnyItems,
        hasRelation: isTargetedAnyItems,
      };
    }
    case ORDER_ITEM: {
      const orderId = getByPathWithDefault('', 'id', order);
      const itemId = getByPathWithDefault('', 'data.id', cell);
      const batchIds = flatten(
        getByPathWithDefault([], 'data.batches', cell).map(item =>
          getByPathWithDefault('', 'id', item)
        )
      );
      const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
      const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${itemId}`);
      const isTargetedAnyBatches = batchIds.some(batchId =>
        state.targets.includes(`${BATCH}-${batchId}`)
      );

      if (position === 'before') {
        return {
          isTargeted: isTargetedOrder && isTargetedItem,
          hasRelation: isTargetedItem,
        };
      }

      return {
        isTargeted: isTargetedItem && isTargetedAnyBatches,
        hasRelation: isTargetedAnyBatches,
      };
    }
    case BATCH: {
      const batchId = getByPathWithDefault('', 'data.id', cell);
      const orderItems = getByPathWithDefault([], 'orderItems', order);
      const findParentItem = orderItems.find(item =>
        item.batches.map(batch => batch.id).includes(batchId)
      );
      const batch = findParentItem.batches.find(item => item.id === batchId);
      const isTargetedBatch = state.targets.includes(`${BATCH}-${batchId}`);
      const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${findParentItem.id}`);
      const isTargetContainer =
        batch.container && state.targets.includes(`${CONTAINER}-${batch.container.id}`);
      const isTargetShipment =
        batch.shipment && state.targets.includes(`${SHIPMENT}-${batch.shipment.id}`);
      if (position === 'before') {
        return {
          isTargeted: isTargetedItem && isTargetedBatch,
          hasRelation: isTargetedItem && isTargetedBatch,
        };
      }

      return {
        isTargeted: isTargetedBatch && (isTargetContainer || isTargetShipment),
        hasRelation: isTargetedBatch,
      };
    }
    case CONTAINER: {
      const containerId = getByPathWithDefault('', 'data.id', cell);
      const isTargetedContainer = state.targets.includes(`${CONTAINER}-${containerId}`);
      const isTargetedBatch = state.targets.includes(
        `${BATCH}-${getByPathWithDefault('', 'data.relatedBatch.id', cell)}`
      );
      const isTargetedShipment = state.targets.includes(
        `${SHIPMENT}-${getByPathWithDefault('', 'data.relatedBatch.shipment.id', cell)}`
      );

      if (position === 'before') {
        return {
          isTargeted: isTargetedContainer && isTargetedBatch,
          hasRelation: isTargetedContainer && isTargetedBatch,
        };
      }
      return {
        isTargeted: isTargetedContainer && isTargetedShipment,
        hasRelation: isTargetedContainer && isTargetedShipment,
      };
    }
    case SHIPMENT: {
      const shipmentId = getByPathWithDefault('', 'data.id', cell);
      const isTargetedShipment = state.targets.includes(`${SHIPMENT}-${shipmentId}`);
      const isTargetedRelateEntity = getByPathWithDefault(null, 'data.relatedBatch.container', cell)
        ? state.targets.includes(
            `${CONTAINER}-${getByPathWithDefault('', 'data.relatedBatch.container.id', cell)}`
          )
        : state.targets.includes(
            `${BATCH}-${getByPathWithDefault('', 'data.relatedBatch.id', cell)}`
          );

      if (position === 'before') {
        return {
          isTargeted: isTargetedShipment && isTargetedRelateEntity,
          hasRelation: isTargetedShipment && isTargetedRelateEntity,
        };
      }
      return {
        isTargeted: false,
        hasRelation: false,
      };
    }
    case 'duplicateOrder': {
      const itemPosition = getByPathWithDefault(0, 'data.itemPosition', cell);
      const items = getByPathWithDefault('', 'orderItems', order);
      let foundPosition = -1;
      for (let index = items.length - 1; index > 0; index -= 1) {
        const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${items[index].id}`);
        if (isTargetedItem) {
          foundPosition = index;
          break;
        }
      }
      const isTargetedOrder = state.targets.includes(
        `${ORDER}-${getByPathWithDefault('', 'id', order)}`
      );
      return {
        isTargeted: isTargetedOrder && foundPosition >= itemPosition,
        hasRelation: false,
      };
    }
    case 'duplicateOrderItem': {
      const itemId = getByPathWithDefault(
        '',
        `orderItems.${getByPathWithDefault(0, 'data.itemPosition', cell)}.id`,
        order
      );
      const batchPosition = getByPathWithDefault(0, 'data.batchPosition', cell);
      const batches = getByPathWithDefault(
        '',
        `orderItems.${getByPathWithDefault(0, 'data.itemPosition', cell)}.batches`,
        order
      );
      let foundPosition = -1;
      for (let index = batches.length - 1; index > 0; index -= 1) {
        const isTargetedBatch = state.targets.includes(`${BATCH}-${batches[index].id}`);
        if (isTargetedBatch) {
          foundPosition = index;
          break;
        }
      }
      const isTargetedItem = state.targets.includes(`${ORDER_ITEM}-${itemId}`);
      return {
        isTargeted: isTargetedItem && foundPosition >= batchPosition,
        hasRelation: false,
      };
    }
    case 'itemSummary': {
      if (isExpand) {
        return {
          isTargeted: false,
          hasRelation: false,
        };
      }
      const orderId = getByPathWithDefault('', 'data.id', cell);
      const orderItemIds = flatten(
        getByPathWithDefault([], 'data.orderItems', cell).map(item =>
          getByPathWithDefault('', 'id', item)
        )
      );
      const batchIds = flatten(
        getByPathWithDefault([], 'data.orderItems', cell).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'id', batch)
          )
        )
      );
      const isTargetedOrder = state.targets.includes(`${ORDER}-${orderId}`);
      const isTargetedAnyItems = orderItemIds.some(itemId =>
        state.targets.includes(`${ORDER_ITEM}-${itemId}`)
      );
      const isTargetedAnyBatches = batchIds.some(batchId =>
        state.targets.includes(`${BATCH}-${batchId}`)
      );
      if (position === 'before') {
        return {
          isTargeted: isTargetedOrder && isTargetedAnyItems,
          hasRelation: isTargetedOrder,
        };
      }
      return {
        isTargeted: isTargetedAnyItems && isTargetedAnyBatches,
        hasRelation: isTargetedAnyBatches,
      };
    }
    case 'batchSummary': {
      if (isExpand) {
        return {
          isTargeted: false,
          hasRelation: false,
        };
      }
      const orderItemIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault('', 'id', item)
        )
      );
      const batchIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'id', batch)
          )
        )
      );
      const isTargetedAnyItems = orderItemIds.some(itemId =>
        state.targets.includes(`${ORDER_ITEM}-${itemId}`)
      );
      const isTargetedAnyBatches = batchIds.some(batchId =>
        state.targets.includes(`${BATCH}-${batchId}`)
      );
      const containerCount = getByPathWithDefault(0, 'containerCount', order);
      const containerIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'container.id', batch)
          )
        )
      );
      const shipmentIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'shipment.id', batch)
          )
        )
      );
      const isTargetedAnyShipments = shipmentIds.some(batchId =>
        state.targets.includes(`${SHIPMENT}-${batchId}`)
      );
      const isTargetedAnyContainers = containerIds.some(containerId =>
        state.targets.includes(`${CONTAINER}-${containerId}`)
      );
      if (position === 'before') {
        return {
          isTargeted: isTargetedAnyItems && isTargetedAnyBatches,
          hasRelation: isTargetedAnyBatches,
        };
      }
      return {
        isTargeted: containerCount
          ? isTargetedAnyBatches && isTargetedAnyContainers
          : isTargetedAnyBatches && isTargetedAnyShipments,
        hasRelation: containerCount
          ? isTargetedAnyBatches && isTargetedAnyContainers
          : isTargetedAnyBatches && isTargetedAnyShipments,
      };
    }
    case 'shipmentWithoutContainer': {
      const isTargetedBatch = state.targets.includes(
        `${BATCH}-${getByPathWithDefault('', 'data.relatedBatch.id', cell)}`
      );
      const isTargetedShipment = state.targets.includes(
        `${SHIPMENT}-${getByPathWithDefault('', 'data.relatedBatch.shipment.id', cell)}`
      );
      return {
        isTargeted: isTargetedBatch && isTargetedShipment,
        hasRelation: isTargetedBatch && isTargetedShipment,
      };
    }
    case 'containerSummary': {
      if (isExpand) {
        return {
          isTargeted: false,
          hasRelation: false,
        };
      }
      const containerCount = getByPathWithDefault(0, 'containerCount', order);
      const batchIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'id', batch)
          )
        )
      );
      const containerIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'container.id', batch)
          )
        )
      );
      const shipmentIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'shipment.id', batch)
          )
        )
      );
      const isTargetedAnyBatches = batchIds.some(batchId =>
        state.targets.includes(`${BATCH}-${batchId}`)
      );
      const isTargetedAnyShipments = shipmentIds.some(batchId =>
        state.targets.includes(`${SHIPMENT}-${batchId}`)
      );
      const isTargetedAnyContainers = containerIds.some(containerId =>
        state.targets.includes(`${CONTAINER}-${containerId}`)
      );
      if (position === 'before') {
        return {
          isTargeted: containerCount
            ? isTargetedAnyBatches && isTargetedAnyContainers
            : isTargetedAnyBatches && isTargetedAnyShipments,
          hasRelation: containerCount
            ? isTargetedAnyBatches && isTargetedAnyContainers
            : isTargetedAnyBatches && isTargetedAnyShipments,
        };
      }
      return {
        isTargeted: containerCount
          ? isTargetedAnyContainers && isTargetedAnyShipments
          : isTargetedAnyShipments,
        hasRelation: isTargetedAnyShipments,
      };
    }
    case 'shipmentSummary': {
      if (isExpand) {
        return {
          isTargeted: false,
          hasRelation: false,
        };
      }
      const containerCount = getByPathWithDefault(0, 'containerCount', order);
      const batchIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'id', batch)
          )
        )
      );
      const containerIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'container.id', batch)
          )
        )
      );
      const shipmentIds = flatten(
        getByPathWithDefault([], 'orderItems', order).map(item =>
          getByPathWithDefault([], 'batches', item).map(batch =>
            getByPathWithDefault('', 'shipment.id', batch)
          )
        )
      );
      const isTargetedAnyBatches = batchIds.some(batchId =>
        state.targets.includes(`${BATCH}-${batchId}`)
      );
      const isTargetedAnyContainers = containerIds.some(containerId =>
        state.targets.includes(`${CONTAINER}-${containerId}`)
      );
      const isTargetedAnyShipments = shipmentIds.some(batchId =>
        state.targets.includes(`${SHIPMENT}-${batchId}`)
      );
      if (position === 'before') {
        return {
          isTargeted: containerCount
            ? isTargetedAnyContainers && isTargetedAnyShipments
            : isTargetedAnyBatches && isTargetedAnyShipments,
          hasRelation: containerCount
            ? isTargetedAnyContainers && isTargetedAnyShipments
            : isTargetedAnyBatches && isTargetedAnyShipments,
        };
      }
      return {
        isTargeted: false,
        hasRelation: false,
      };
    }
    default:
      break;
  }
  return {
    isTargeted: false,
    hasRelation: false,
  };
};
