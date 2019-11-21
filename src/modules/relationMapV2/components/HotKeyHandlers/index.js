// @flow
import * as React from 'react';
import hotkeys from 'hotkeys-js';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { useAllHasPermission } from 'contexts/Permissions';
import { hasInPortal } from 'hooks/usePortalSlot';
import { SLIDEVIEW_PORTAL_NAME } from 'components/SlideView';
import { DIALOG_PORTAL_NAME } from 'components/Dialog';

function HotKeyHandlers() {
  const { mapping } = Entities.useContainer();
  const { dispatch, selectors } = FocusedView.useContainer();
  const {
    batchIds,
    orderIds,
    containerIds,
    shipmentIds,
    importerIds,
    exporterIds,
  } = selectors.relatedIds(mapping);

  const hasPermissions = useAllHasPermission(
    batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.ownedBy).filter(Boolean)
  );

  const isSameImporter = React.useCallback(() => {
    return importerIds.length <= 1;
  }, [importerIds]);

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
    if (batchIds.length > 0) {
      hotkeys.unbind('alt+1');
      hotkeys('alt+1', () => {
        const noSlideViewsOrDialogsOpen = !(
          hasInPortal(SLIDEVIEW_PORTAL_NAME) || hasInPortal(DIALOG_PORTAL_NAME)
        );

        const isAllow =
          batchIds.length > 0 &&
          (noSlideViewsOrDialogsOpen || !!document.querySelector('#moveBatches'));
        if (hasPermissionMoveToExistShipment() && isAllow) openShipments();
      });
    } else {
      hotkeys.unbind('alt+1');
    }
  }, [batchIds, hasPermissionMoveToExistShipment, openShipments]);

  return null;
}

export default HotKeyHandlers;
