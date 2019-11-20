// @flow
import * as React from 'react';
import type { OrderPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import {
  ORDER,
  ORDER_ITEM,
  ORDER_ITEMS,
  BATCH,
  BATCHES,
  CONTAINER,
  SHIPMENT,
} from 'modules/relationMapV2/constants';
import { ORDER_UPDATE } from 'modules/permission/constants/order';
import { ORDER_ITEMS_UPDATE } from 'modules/permission/constants/orderItem';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { CONTAINER_BATCHES_ADD } from 'modules/permission/constants/container';
import { SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH } from 'modules/permission/constants/shipment';
import { findParentIdsByBatch, findOrderIdByItem } from 'modules/relationMapV2/helpers';

// NOTE: only support for drag and drop a batch and order item
export const hasPermissionToMove = ({
  type,
  hasPermissions,
}: {|
  hasPermissions: (Array<string> | string) => boolean,
  type: typeof ORDER | typeof ORDER_ITEM | typeof BATCH | typeof CONTAINER | typeof SHIPMENT,
|}) => {
  switch (type) {
    case ORDER_ITEM: {
      // move a item to order
      return hasPermissions([ORDER_ITEMS_UPDATE, ORDER_UPDATE]);
    }

    case BATCH: {
      // move a batch to order item or order
      return hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
    }

    case SHIPMENT: {
      return hasPermissions([CONTAINER_BATCHES_ADD, SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH]);
    }

    default:
      return true;
  }
};

export const orderDropMessage = ({
  orderId,
  entities,
  hasPermissions,
  item,
}: {|
  entities: Object,
  hasPermissions: Function,
  orderId: string,
  item: ?{
    type: string,
    id: string,
  },
|}) => {
  const type = item?.type ?? '';
  switch (type) {
    case ORDER_ITEM: {
      const itemId = item?.id ?? '';
      const parentOrderId = findOrderIdByItem({ orderItemId: itemId, entities, viewer: ORDER });
      if (!parentOrderId) return '';

      const isOwnOrder = orderId === parentOrderId;
      if (isOwnOrder)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (<FormattedMessage id="modules.RelationMap.dnd.sameOrder" defaultMessage="SAME ORDER" />
            )
          </div>
        );

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', entities.orders[orderId]) !==
        getByPathWithDefault('', 'importer.id', entities.orders[parentOrderId]);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        getByPathWithDefault('', 'exporter.id', entities.orders[orderId]) !==
        getByPathWithDefault('', 'exporter.id', entities.orders[parentOrderId]);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({
        hasPermissions,
        type: BATCH,
      });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveToOrder"
            defaultMessage="MOVE TO ORDER"
          />
        </div>
      );
    }

    case BATCH: {
      const batchId = item?.id ?? '';
      const [, parentOrderId] = findParentIdsByBatch({ batchId, entities, viewer: ORDER });
      if (!parentOrderId) return '';

      const isOwnOrder = orderId === parentOrderId;
      if (isOwnOrder)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (<FormattedMessage id="modules.RelationMap.dnd.sameOrder" defaultMessage="SAME ORDER" />
            )
          </div>
        );

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', entities.orders[orderId]) !==
        getByPathWithDefault('', 'importer.id', entities.orders[parentOrderId]);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        getByPathWithDefault('', 'exporter.id', entities.orders[orderId]) !==
        getByPathWithDefault('', 'exporter.id', entities.orders[parentOrderId]);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({
        hasPermissions,
        type: BATCH,
      });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveToOrder"
            defaultMessage="MOVE TO ORDER"
          />
          <br />
          (
          <FormattedMessage
            id="modules.RelationMap.dnd.itemGenerated"
            defaultMessage="ITEM WILL BE GENERATED"
          />
          )
        </div>
      );
    }

    case BATCHES: {
      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.noOrderPermission"
            defaultMessage="CANNOT MOVE TO ORDER"
          />
        </div>
      );
    }

    case ORDER_ITEMS: {
      const itemIds = item?.id.split(',') ?? [];
      const parentOrderIds = [
        ...new Set(
          itemIds
            .map(itemId => findOrderIdByItem({ orderItemId: itemId, entities, viewer: ORDER }))
            .filter(Boolean)
        ),
      ];

      const isSameParent = parentOrderIds.length === 1 && parentOrderIds.includes(orderId);
      if (isSameParent)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (<FormattedMessage id="modules.RelationMap.dnd.sameOrder" defaultMessage="SAME ORDER" />
            )
          </div>
        );
      const importerIds = [];
      const exporterIds = [];
      parentOrderIds.forEach(currentOrderId => {
        const order = entities?.orders?.[currentOrderId];
        const importId = order?.importer?.id;
        const exporterId = order?.exporter?.id;
        if (importId && !importerIds.includes(importId)) {
          importerIds.push(importId);
        }
        if (exporterId && !exporterIds.includes(exporterId)) {
          exporterIds.push(exporterId);
        }
      });

      const isDifferentImporter =
        importerIds.length > 1 || !importerIds.includes(entities?.orders?.[orderId]?.importer?.id);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );
      const isDifferentExporter =
        exporterIds.length > 1 || !exporterIds.includes(entities?.orders?.[orderId]?.exporter?.id);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );
      const noPermission = !hasPermissionToMove({
        hasPermissions,
        type,
      });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noOrderPermission"
              defaultMessage="CANNOT MOVE TO ORDER"
            />
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );
      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveToOrder"
            defaultMessage="MOVE TO ORDER"
          />
        </div>
      );
    }

    default:
      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.noOrderPermission"
            defaultMessage="CANNOT MOVE TO ORDER"
          />
        </div>
      );
  }
};

export const orderItemDropMessage = ({
  itemId,
  hasPermissions,
  order,
  entities,
  item,
}: {|
  entities: Object,
  hasPermissions: Function,
  itemId: string,
  order: OrderPayload,
  item: {
    type: string,
    id: string,
  },
|}) => {
  const type = item?.type ?? '';
  switch (type) {
    case BATCH: {
      const batchId = item && item.id;
      const [parentItemId, parentOrderId] = findParentIdsByBatch({
        batchId,
        entities,
        viewer: ORDER,
      });
      if (!parentItemId || !parentOrderId) return '';

      const isOwnItem = parentItemId === itemId;
      if (isOwnItem)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noItemPermission"
              defaultMessage="CANNOT MOVE TO ITEM"
            />{' '}
            <br />
            (<FormattedMessage id="modules.RelationMap.dnd.sameItem" defaultMessage="SAME ITEM" />)
          </div>
        );

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', order) !==
        getByPathWithDefault('', 'importer.id', entities.orders[parentOrderId]);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noItemPermission"
              defaultMessage="CANNOT MOVE TO ITEM"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        getByPathWithDefault('', 'exporter.id', order) !==
        getByPathWithDefault('', 'exporter.id', entities.orders[parentOrderId]);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noItemPermission"
              defaultMessage="CANNOT MOVE TO ITEM"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({
        hasPermissions,
        type: BATCH,
      });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noItemPermission"
              defaultMessage="CANNOT MOVE TO ITEM"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage id="modules.RelationMap.dnd.moveItem" defaultMessage="MOVE TO ITEM" />
        </div>
      );
    }

    default:
      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.noItemPermission"
            defaultMessage="CANNOT MOVE TO ITEM"
          />
        </div>
      );
  }
};

export const containerDropMessage = ({
  containerId,
  entities,
  item,
  hasPermissions,
}: {|
  hasPermissions: Function,
  entities: Object,
  containerId: string,
  item: ?{
    type: string,
    id: string,
  },
|}) => {
  const type = item?.type ?? '';
  switch (type) {
    case BATCH: {
      const batchId = item?.id ?? '';
      const [, parentOrderId] = findParentIdsByBatch({ batchId, entities, viewer: ORDER });
      if (!parentOrderId) return '';
      const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
      const isOwnContainer = batch.container === containerId;
      if (isOwnContainer)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noContainerPermission"
              defaultMessage="CANNOT MOVE TO CONTAINER"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.sameContainer"
              defaultMessage="SAME CONTAINER"
            />
            )
          </div>
        );

      const container = getByPathWithDefault({}, `containers.${containerId}`, entities);
      const shipment = getByPathWithDefault({}, `shipments.${container.shipment}`, entities);
      const order = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', shipment) !==
        getByPathWithDefault('', 'importer.id', order);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noContainerPermission"
              defaultMessage="CANNOT MOVE TO CONTAINER"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        shipment.exporter &&
        getByPathWithDefault('', 'exporter.id', shipment) !==
          getByPathWithDefault('', 'exporter.id', order);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noContainerPermission"
              defaultMessage="CANNOT MOVE TO CONTAINER"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({ hasPermissions, type: SHIPMENT });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noContainerPermission"
              defaultMessage="CANNOT MOVE TO CONTAINER"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveContainer"
            defaultMessage="MOVE TO CONTAINER"
          />
        </div>
      );
    }

    default:
      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.noContainerPermission"
            defaultMessage="CANNOT MOVE TO CONTAINER"
          />
        </div>
      );
  }
};

export const shipmentDropMessage = ({
  shipmentId,
  entities,
  item,
  hasPermissions,
}: {|
  hasPermissions: Function,
  entities: Object,
  shipmentId: string,
  item: ?{
    type: string,
    id: string,
  },
|}) => {
  const type = item?.type ?? '';
  switch (type) {
    case BATCHES: {
      const shipment = entities?.shipments?.[shipmentId];
      const batchIds = item?.id.split(',') ?? [];
      const shipmentIds = [
        ...new Set(batchIds.map(batchId => entities?.batches?.[batchId]?.shipment).filter(Boolean)),
      ];
      const orderIds = [
        ...new Set(
          batchIds
            .map(batchId => {
              const [, parentOrderId] = findParentIdsByBatch({
                batchId,
                entities,
                viewer: ORDER,
              });
              return parentOrderId;
            })
            .filter(Boolean)
        ),
      ];

      const importerIds = [];
      const exporterIds = [];
      orderIds.forEach(orderId => {
        const order = entities?.orders?.[orderId];
        const importId = order?.importer?.id;
        const exporterId = order?.exporter?.id;
        if (importId && !importerIds.includes(importId)) {
          importerIds.push(importId);
        }
        if (exporterId && !exporterIds.includes(exporterId)) {
          exporterIds.push(exporterId);
        }
      });
      const isSameParent =
        shipmentIds.length === 1 &&
        shipmentIds.includes(shipmentId) &&
        batchIds.every(batchId => !!entities?.batches?.[batchId]?.shipment);
      if (isSameParent)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.sameShipment"
              defaultMessage="SAME SHIPMENT"
            />
            )
          </div>
        );

      const isDifferentImporter = !importerIds.includes(shipment.importer?.id);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        (exporterIds.length === 1 &&
          !exporterIds.includes(shipment.exporter?.id) &&
          shipment.exporter?.id) ||
        (exporterIds.length > 1 && shipment.exporter?.id);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissions([BATCH_UPDATE, SHIPMENT_ADD_BATCH]);
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveShipment"
            defaultMessage="MOVE TO SHIPMENT"
          />
        </div>
      );
    }
    case BATCH: {
      const batchId = item?.id ?? '';
      const [, parentOrderId] = findParentIdsByBatch({ batchId, entities, viewer: ORDER });
      if (!parentOrderId) return '';
      const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
      const isOwnShipment = batch.shipment === shipmentId;
      if (isOwnShipment)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.sameShipment"
              defaultMessage="SAME SHIPMENT"
            />
            )
          </div>
        );

      const shipment = getByPathWithDefault({}, `shipments.${shipmentId}`, entities);
      const order = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);

      const isDifferentImporter =
        getByPathWithDefault('', 'importer.id', shipment) !==
        getByPathWithDefault('', 'importer.id', order);
      if (isDifferentImporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.importerMismatch"
              defaultMessage="IMPORTER MISMATCHED"
            />
            )
          </div>
        );

      const isDifferentExporter =
        shipment.exporter &&
        getByPathWithDefault('', 'exporter.id', shipment) !==
          getByPathWithDefault('', 'exporter.id', order);
      if (isDifferentExporter)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.exporterMismatch"
              defaultMessage="EXPORTER MISMATCHED"
            />
            )
          </div>
        );

      const noPermission = !hasPermissionToMove({ hasPermissions, type: SHIPMENT });
      if (noPermission)
        return (
          <div>
            <FormattedMessage
              id="modules.RelationMap.dnd.noShipmentPermission"
              defaultMessage="CANNOT MOVE TO SHIPMENT"
            />{' '}
            <br />
            (
            <FormattedMessage
              id="modules.RelationMap.dnd.noPermission"
              defaultMessage="NO PERMISSION"
            />
            )
          </div>
        );

      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.moveShipment"
            defaultMessage="MOVE TO SHIPMENT"
          />
        </div>
      );
    }

    default:
      return (
        <div>
          <FormattedMessage
            id="modules.RelationMap.dnd.noShipmentPermission"
            defaultMessage="CANNOT MOVE TO SHIPMENT"
          />
        </div>
      );
  }
};
