// @flow
import { getBatchLatestQuantity } from 'utils/batch';
import { AC } from 'components/Sheet/SheetAction';
import BaseBatchMoveToExistingOrderAction from 'modules/sheet/batch/actions/BatchMoveToExistingOrderAction';
import BaseBatchMoveToNewOrderAction from 'modules/sheet/batch/actions/BatchMoveToNewOrderAction';
import BaseBatchMoveToExistingContainerAction from 'modules/sheet/batch/actions/BatchMoveToExistingContainerAction';
import BaseBatchMoveToExistingShipmentAction from 'modules/sheet/batch/actions/BatchMoveToExistingShipmentAction';
import BaseBatchMoveToNewShipmentAction from 'modules/sheet/batch/actions/BatchMoveToNewShipmentAction';
import BaseBatchMoveToNewContainerOnExistShipmentAction from 'modules/sheet/batch/actions/BatchMoveToNewContainerOnExistShipmentAction';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { ORDER_ITEMS_CREATE } from 'modules/permission/constants/orderItem';
import {
  BATCH_SET_CONTAINER,
  BATCH_SET_SHIPMENT,
  BATCH_UPDATE,
  BATCH_SET_ORDER_ITEM,
} from 'modules/permission/constants/batch';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import {
  SHIPMENT_CREATE,
  SHIPMENT_UPDATE,
  SHIPMENT_ADD_BATCH,
} from 'modules/permission/constants/shipment';
import { unDecorateBatch } from './decorator';

function findBatch(batchId: string, shipment: Object): ?Object {
  return [...shipment.batchesWithoutContainer, ...shipment.containers.flatMap(c => c.batches)].find(
    b => b.id === batchId
  );
}

const BatchMoveToExistingOrderAction = BaseBatchMoveToExistingOrderAction({
  getCurrency: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.currency,
  getOrderId: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.id,
  getImporterId: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.importer?.id,
  getExporterId: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.exporter?.id,
  getLatestQuantity: (batchId, item) => getBatchLatestQuantity(findBatch(batchId, item)),
  getProductProviderId: (batchId, item) => findBatch(batchId, item)?.orderItem?.productProvider?.id,
  getOrderItemNo: (batchId, item) => findBatch(batchId, item)?.orderItem?.no,
  getOrderItemPrice: (batchId, item) => {
    const orderItem = findBatch(batchId, item)?.orderItem;
    return { amount: orderItem?.price?.value, currency: orderItem.price?.metric };
  },
});

const BatchMoveToExistingContainerAction = BaseBatchMoveToExistingContainerAction({
  getContainerId: (batchId, item) =>
    item.containers.find(c => c.batches.some(b => b.id === batchId))?.id,
  getImporterId: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.importer?.id,
  getExporterId: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.exporter?.id,
});

const BatchMoveToExistingShipmentAction = BaseBatchMoveToExistingShipmentAction({
  getBatch: (batchId, item) => unDecorateBatch(findBatch(batchId, item)),
  getImporter: (batchId, item) => item.importer,
  getExporter: (batchId, item) => item.exporter,
});

const BatchMoveToNewOrderAction = BaseBatchMoveToNewOrderAction({
  getContainer: (batchId, item) => item.containers.find(c => c.batches.some(b => b.id === batchId)),
  getShipment: (batchId, item) => item,
  getBatch: (batchId, item) => unDecorateBatch(findBatch(batchId, item)),
  getOrderItem: (batchId, item) => findBatch(batchId, item)?.orderItem,
  getExporter: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.exporter,
});

const BatchMoveToNewContainerOnExistShipmentAction = BaseBatchMoveToNewContainerOnExistShipmentAction(
  {
    getImporter: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.importer,
    getExporter: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.exporter,
    getBatch: (batchId, item) => unDecorateBatch(findBatch(batchId, item)),
    getOrderItem: (batchId, item) => findBatch(batchId, item)?.orderItem,
  }
);

const BatchMoveToNewShipmentAction = BaseBatchMoveToNewShipmentAction({
  getImporter: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.importer,
  getExporter: (batchId, item) => findBatch(batchId, item)?.orderItem?.order?.exporter,
  getBatch: (batchId, item) => unDecorateBatch(findBatch(batchId, item)),
  getOrderItem: (batchId, item) => findBatch(batchId, item)?.orderItem,
});

export default {
  batch_move_order: AC(
    BatchMoveToExistingOrderAction,
    hasPermissions =>
      hasPermissions(ORDER_ITEMS_CREATE) &&
      (hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_ORDER_ITEM))
  ),
  batch_move_new_order: AC(
    BatchMoveToNewOrderAction,
    hasPermissions =>
      hasPermissions(ORDER_CREATE) &&
      (hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_ORDER_ITEM))
  ),
  batch_move_container: AC(
    BatchMoveToExistingContainerAction,
    hasPermissions => hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_CONTAINER)
  ),
  batch_move_new_container: AC(
    BatchMoveToNewContainerOnExistShipmentAction,
    hasPermissions =>
      hasPermissions(CONTAINER_CREATE) &&
      (hasPermissions(SHIPMENT_UPDATE) || hasPermissions(SHIPMENT_ADD_BATCH)) &&
      (hasPermissions(BATCH_UPDATE) ||
        (hasPermissions(BATCH_SET_SHIPMENT) && hasPermissions(BATCH_SET_CONTAINER)))
  ),
  batch_move_shipment: AC(
    BatchMoveToExistingShipmentAction,
    hasPermissions => hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_SHIPMENT)
  ),
  batch_move_new_shipment: AC(
    BatchMoveToNewShipmentAction,
    hasPermissions =>
      hasPermissions(SHIPMENT_CREATE) &&
      (hasPermissions(BATCH_UPDATE) || hasPermissions(BATCH_SET_SHIPMENT))
  ),
};
