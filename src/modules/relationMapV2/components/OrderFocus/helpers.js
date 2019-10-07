// @flow
import type { BatchPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { ClientSorts, Entities } from 'modules/relationMapV2/store';
import type { CellRender } from 'modules/relationMapV2/type.js.flow';

export function orderCell({
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

export function containerCell(batch: BatchPayload): ?CellRender {
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
      const itemsList = getItemsSortByOrderId({ id: order.id, orderItems, getRelatedBy })
        .map(itemId => orderItems.find(orderItem => orderItem?.id === itemId))
        .filter(Boolean);

      itemsList.forEach((item, index) => {
        const batches = item?.batches ?? [];
        if (batches.length) {
          const batchesList = getBatchesSortByItemId({ id: item.id, batches, getRelatedBy })
            .map(batchId => batches.find(batchItem => batchItem?.id === batchId))
            .filter(Boolean);
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
