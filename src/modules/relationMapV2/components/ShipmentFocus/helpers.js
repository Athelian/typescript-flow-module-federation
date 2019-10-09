// @flow
import type { BatchPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import type { CellRender } from 'modules/relationMapV2/type.js.flow';

export function orderCell({
  itemPosition,
  batchPosition,
  shipment,
  totalItems,
}: {|
  itemPosition: number,
  batchPosition: number,
  shipment: mixed,
  totalItems: number,
|}) {
  if (itemPosition === 0 && batchPosition === 0)
    return {
      type: ORDER,
      data: shipment,
      afterConnector: 'HORIZONTAL',
    };
  const isTheLastItemWithFirstBatch = itemPosition === totalItems - 1 && batchPosition === 0;
  const isNotTheLastItem = itemPosition < totalItems - 1 && totalItems > 1;
  if (isTheLastItemWithFirstBatch || isNotTheLastItem)
    return {
      type: 'duplicateOrder',
      data: {
        shipment,
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

export const shipmentCoordinates = memoize(
  ({ isExpand, shipment }: { isExpand: boolean, shipment: Object }): Array<?CellRender> => {
    const containerCount = shipment?.containerCount ?? 0;
    const batchCount = shipment?.batchCount ?? 0;
    if (!isExpand) {
      return batchCount
        ? [
            {
              type: SHIPMENT,
              data: shipment,
              afterConnector: 'HORIZONTAL',
            },
            {
              ...(containerCount || batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'containerSummary',
              data: shipment,
              ...(batchCount ? { afterConnector: 'HORIZONTAL' } : {}),
            },
            {
              ...(batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'batchSummary',
              data: shipment,
              ...(batchCount ? { afterConnector: 'HORIZONTAL' } : {}),
            },
            {
              ...(batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'itemSummary',
              data: shipment,
              ...(batchCount ? { afterConnector: 'HORIZONTAL' } : {}),
            },
            {
              ...(batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'orderSummary',
              data: shipment,
            },
          ]
        : [
            {
              type: SHIPMENT,
              data: shipment,
            },
            null,
            null,
            null,
            null,
          ];
    }
    const result = [
      {
        type: 'shipmentPlaceholder',
      },
      {
        type: 'containerSummary',
        data: shipment,
      },
      {
        type: 'batchSummary',
        data: shipment,
      },
      batchCount
        ? {
            type: 'itemSummary',
            data: shipment,
          }
        : {
            type: 'itemSummary',
            data: null,
          },
      {
        type: 'orderSummary',
        data: shipment,
      },
    ];

    if (containerCount || batchCount) {
      result.push(
        ...[
          {
            type: SHIPMENT,
            data: shipment,
          },
          null,
          null,
          null,
          null,
        ]
      );
      // batches without container on the top
      const batchesWithoutContainers = (shipment?.batches ?? []).filter(batch => !batch?.container);
      batchesWithoutContainers.forEach(batch => {
        result.push(
          ...[
            {
              type: 'duplicateShipment',
              data: shipment,
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: 'shipmentWithoutContainer',
              data: {
                shipment,
                relatedBatch: batch,
              },
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: BATCH,
              data: batch,
              afterConnector: batch && (batch.container || batch.shipment) ? 'HORIZONTAL' : null,
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: ORDER_ITEM,
              data: batch,
              afterConnector: 'HORIZONTAL',
            },
            {
              beforeConnector: 'HORIZONTAL',
              type: ORDER,
              data: batch,
            },
          ]
        );
      });

      // TODO: container with batches
    } else {
      // shipment which has no item
      result.push(
        ...[
          {
            type: SHIPMENT,
            data: shipment,
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
