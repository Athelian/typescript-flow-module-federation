// @flow
import memoize from 'memoize-one';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import type { CellRender } from 'modules/relationMapV2/type.js.flow';

export function shipmentCell({
  containerPosition,
  batchPosition,
  shipment,
  totalContainers,
  hasBatchesInPool,
}: {|
  containerPosition: number,
  batchPosition: number,
  hasBatchesInPool: boolean,
  shipment: mixed,
  totalContainers: number,
|}) {
  const isTheLastItemWithFirstBatch =
    containerPosition === totalContainers - 1 && batchPosition === 0;
  const isNotTheLastItem = containerPosition < totalContainers - 1 && totalContainers > 1;
  if (hasBatchesInPool) {
    return {
      type: 'duplicateShipment',
      data: {
        shipment,
        containerPosition,
        batchPosition,
      },
      ...(isTheLastItemWithFirstBatch || isNotTheLastItem ? { afterConnector: 'VERTICAL' } : {}),
    };
  }

  if (containerPosition === 0 && batchPosition === 0)
    return {
      type: SHIPMENT,
      data: shipment,
      afterConnector: 'HORIZONTAL',
    };

  if (isTheLastItemWithFirstBatch || isNotTheLastItem)
    return {
      type: 'duplicateShipment',
      data: {
        shipment,
        containerPosition,
        batchPosition,
      },
      afterConnector: 'VERTICAL',
    };

  return {
    type: 'duplicateShipment',
    data: {
      shipment,
      containerPosition,
      batchPosition,
    },
  };
}

export const shipmentCoordinates = memoize(
  ({
    isExpand,
    shipment,
    getContainersSortByShipmentId,
    getBatchesSortByShipmentId,
    getBatchesSortByContainerId,
    getRelatedBy,
    newBatchIDs,
    newContainerIDs,
  }: {
    isExpand: boolean,
    shipment: Object,
    getContainersSortByShipmentId: Function,
    getBatchesSortByShipmentId: Function,
    getBatchesSortByContainerId: Function,
    getRelatedBy: Function,
    newBatchIDs: Array<string>,
    newContainerIDs: Array<string>,
  }): Array<?CellRender> => {
    const containerCount = shipment?.containerCount ?? 0;
    const batchCount = shipment?.batchCount ?? 0;
    const batches = shipment?.batches ?? [];
    const containers = shipment?.containers ?? [];
    if (!isExpand) {
      return batchCount || containerCount
        ? [
            {
              type: SHIPMENT,
              data: shipment,
              afterConnector: 'HORIZONTAL',
            },
            {
              /* $FlowFixMe This comment suppresses an error found when
               * upgrading Flow to v0.111.0. To view the error, delete this
               * comment and run Flow. */
              ...(containerCount || batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'containerSummary',
              data: shipment,
              ...(batchCount ? { afterConnector: 'HORIZONTAL' } : {}),
            },
            {
              /* $FlowFixMe This comment suppresses an error found when
               * upgrading Flow to v0.111.0. To view the error, delete this
               * comment and run Flow. */
              ...(batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
              type: 'batchSummary',
              data: shipment,
              ...(batchCount ? { afterConnector: 'HORIZONTAL' } : {}),
            },
            batchCount
              ? {
                  /* $FlowFixMe This comment suppresses an error found when
                   * upgrading Flow to v0.111.0. To view the error, delete this
                   * comment and run Flow. */
                  ...(batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
                  type: 'itemSummary',
                  data: shipment,
                  ...(batchCount ? { afterConnector: 'HORIZONTAL' } : {}),
                }
              : null,
            batchCount
              ? {
                  ...(batchCount ? { beforeConnector: 'HORIZONTAL' } : {}),
                  type: 'orderSummary',
                  data: shipment,
                }
              : null,
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
    const result =
      batchCount || containerCount
        ? [
            {
              type: 'duplicateShipment',
            },
            containerCount
              ? {
                  type: 'containerSummary',
                  data: shipment,
                }
              : {
                  type: 'containerPlaceholder',
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
              : null,
            {
              type: 'orderSummary',
              data: shipment,
            },
          ]
        : [];

    if (containerCount || batchCount) {
      // batches without container on the top
      const batchesWithoutContainers = batches.filter(batch => !batch?.container);
      const batchesWithContainers = batches.filter(batch => !!batch?.container);
      const batchesList = getBatchesSortByShipmentId({
        id: shipment.id,
        batches: batchesWithoutContainers,
        getRelatedBy,
        newBatchIDs,
      })
        .map(batchId => batchesWithoutContainers.find(batchItem => batchItem?.id === batchId))
        .filter(Boolean);
      batchesList.forEach((batch, index) => {
        result.push(
          ...[
            index
              ? {
                  type: 'duplicateShipment',
                  data: {
                    shipment,
                    batchPosition: index,
                    containerPosition: -1,
                  },
                  afterConnector: 'VERTICAL',
                }
              : {
                  type: SHIPMENT,
                  data: shipment,
                  afterConnector: 'HORIZONTAL',
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

      const containerList = getContainersSortByShipmentId({
        id: shipment.id,
        containers,
        getRelatedBy,
        newContainerIDs,
      })
        .map(containerId => containers.find(container => container?.id === containerId))
        .filter(Boolean);
      containerList.forEach((container, index) => {
        const batchesByContainer = batchesWithContainers.filter(
          batch => batch.container.id === container.id
        );
        if (batchesByContainer.length) {
          const batchesSortedList = getBatchesSortByContainerId({
            id: container.id,
            batches: batchesByContainer,
            getRelatedBy,
            newBatchIDs,
          })
            .map(batchId => batchesByContainer.find(batchItem => batchItem?.id === batchId))
            .filter(Boolean);
          batchesSortedList.forEach((batch, counter) => {
            result.push(
              ...[
                shipmentCell({
                  shipment,
                  hasBatchesInPool: batchesWithoutContainers.length > 0,
                  containerPosition: index,
                  batchPosition: counter,
                  totalContainers: containerList.length,
                }),
                counter
                  ? {
                      type: 'duplicateContainer',
                      data: { container, batchPosition: counter },
                      afterConnector: 'VERTICAL',
                    }
                  : {
                      beforeConnector: 'HORIZONTAL',
                      type: CONTAINER,
                      data: container,
                      afterConnector: 'HORIZONTAL',
                    },
                {
                  beforeConnector: 'HORIZONTAL',
                  type: BATCH,
                  data: batch,
                  afterConnector:
                    batch && (batch.container || batch.shipment) ? 'HORIZONTAL' : null,
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
        } else {
          // empty container
          result.push(
            ...[
              index || batchesWithoutContainers.length
                ? {
                    type: 'duplicateShipment',
                    data: { shipment, batchPosition: -1, containerPosition: index },
                    afterConnector: 'VERTICAL',
                  }
                : {
                    type: SHIPMENT,
                    data: shipment,
                    afterConnector: 'HORIZONTAL',
                  },
              {
                beforeConnector: 'HORIZONTAL',
                type: CONTAINER,
                data: container,
              },
              null,
              null,
              null,
            ]
          );
        }
      });
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
