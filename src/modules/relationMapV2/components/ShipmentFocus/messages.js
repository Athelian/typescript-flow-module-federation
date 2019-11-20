// @flow
import * as React from 'react';
import type { OrderPayload } from 'generated/graphql';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { CONTAINER_BATCHES_ADD } from 'modules/permission/constants/container';
import { SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH } from 'modules/permission/constants/shipment';

// NOTE: only support for drag and drop a batch
export const hasPermissionToMove = ({
  type,
  hasPermissions,
}: {|
  hasPermissions: (Array<string> | string) => boolean,
  type: typeof ORDER | typeof ORDER_ITEM | typeof BATCH | typeof CONTAINER | typeof SHIPMENT,
|}) => {
  switch (type) {
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
    case BATCH: {
      const batchId = item?.id ?? '';
      const parentItemId = entities.batches?.[batchId]?.orderItem;
      if (!parentItemId) return '';

      const parentOrderId = entities.orderItems?.[parentItemId]?.order;
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

    default:
      return '';
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
      const batchId = item?.id;
      const parentItemId = entities.batches?.[batchId]?.orderItem;
      if (!parentItemId) return '';

      const parentOrderId = entities.orderItems?.[parentItemId]?.order;
      if (!parentOrderId) return '';

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
      return '';
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
      const parentItemId = entities.batches?.[batchId]?.orderItem;
      if (!parentItemId) return '';

      const parentOrderId = entities.orderItems?.[parentItemId]?.order;
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
      return '';
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
    case BATCH: {
      const batchId = item?.id ?? '';
      const parentItemId = entities.batches?.[batchId]?.orderItem;
      if (!parentItemId) return '';

      const parentOrderId = entities.orderItems?.[parentItemId]?.order;
      if (!parentOrderId) return '';

      const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
      const isOwnShipment = batch.shipment === shipmentId && !batch.container;
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
      return '';
  }
};
