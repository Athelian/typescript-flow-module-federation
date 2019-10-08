// @flow
import type { BatchPayload } from 'generated/graphql';
import memoize from 'memoize-one';
import { getByPathWithDefault } from 'utils/fp';
import { ORDER, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
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
              ...(containerCount ? { beforeConnector: 'HORIZONTAL' } : {}),
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
      null,
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
      // TODO: fill render logic later
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
