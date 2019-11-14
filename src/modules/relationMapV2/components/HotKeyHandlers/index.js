// @flow
import * as React from 'react';
import hotkeys from 'hotkeys-js';
import { BATCH } from 'modules/relationMapV2/constants';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds, findParentIdsByBatch } from 'modules/relationMapV2/helpers';
import { useAllHasPermission } from 'contexts/Permissions';

function HotKeyHandlers() {
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = FocusedView.useContainer();
  const batchIds = targetedIds(state.targets, BATCH);
  const orderIds = [
    ...new Set(
      batchIds
        .map(batchId => {
          const [, parentOrderId] = findParentIdsByBatch({
            batchId,
            viewer: state.viewer,
            entities: mapping.entities,
          });
          return parentOrderId;
        })
        .filter(Boolean)
    ),
  ];
  const containerIds = [
    ...new Set(
      batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.container).filter(Boolean)
    ),
  ];
  const shipmentIds = [
    ...new Set(
      batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.shipment).filter(Boolean)
    ),
  ];
  const importerIds = [];
  const exporterIds = [];
  orderIds.forEach(orderId => {
    const order = mapping.entities?.orders?.[orderId];
    const importId = order?.importer?.id;
    const exporterId = order?.exporter?.id;
    if (importId && !importerIds.includes(importId)) {
      importerIds.push(importId);
    }
    if (exporterId && !exporterIds.includes(exporterId)) {
      exporterIds.push(exporterId);
    }
  });
  const hasPermissions = useAllHasPermission(
    batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.ownedBy).filter(Boolean)
  );

  const isSameImporter = React.useCallback(() => {
    return importerIds.length <= 1;
  }, [importerIds.length]);

  const hasPermissionMoveToExistShipment = React.useCallback(() => {
    return isSameImporter() && hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
  }, [hasPermissions, isSameImporter]);

  const openShipments = React.useCallback(() => {
    dispatch({
      type: 'MOVE_BATCH_START',
      payload: {
        type: 'existShipment',
        from: 'batch',
        orderIds,
        containerIds,
        shipmentIds,
        importerIds,
        exporterIds,
      },
    });
  }, [containerIds, dispatch, exporterIds, importerIds, orderIds, shipmentIds]);

  React.useEffect(() => {
    hotkeys('alt+1', () => {
      if (hasPermissionMoveToExistShipment()) openShipments();
    });
  }, [hasPermissionMoveToExistShipment, openShipments]);

  return null;
}

export default HotKeyHandlers;
