// @flow
import {
  transformValueField,
  transformReadonlyField,
  transformComputedField,
} from 'components/Sheet';
import type { CellValue } from 'components/Sheet/SheetState/types';
/* import {
  ORDER_SET_ARCHIVED,
  ORDER_SET_CURRENCY,
  ORDER_SET_PO_NO,
  ORDER_SET_PI_NO,
  ORDER_SET_DELIVERY_PLACE,
  ORDER_UPDATE,
  ORDER_SET_DELIVERY_DATE,
  ORDER_SET_ISSUE_AT,
  ORDER_SET_INCOTERM,
  ORDER_SET_MEMO,
  ORDER_SET_DOCUMENTS,
} from 'modules/permission/constants/order';
import {
  ORDER_ITEMS_SET_NO,
  ORDER_ITEMS_SET_QUANTITY,
  ORDER_ITEMS_SET_PRICE,
  ORDER_ITEMS_UPDATE,
  ORDER_ITEMS_SET_DELIVERY_DATE,
  ORDER_ITEMS_SET_DOCUMENTS,
} from 'modules/permission/constants/orderItem'; */
import {
  BATCH_SET_DELIVERY_DATE,
  BATCH_SET_DESIRED_DATE,
  BATCH_SET_EXPIRY,
  BATCH_SET_NO,
  BATCH_SET_PACKAGE_CAPACITY,
  BATCH_SET_PACKAGE_NAME,
  BATCH_SET_PACKAGE_QUANTITY,
  BATCH_SET_PRODUCTION_DATE,
  BATCH_SET_QUANTITY,
  BATCH_SET_QUANTITY_ADJUSTMENTS,
  BATCH_UPDATE,
} from 'modules/permission/constants/batch';
import {
  CONTAINER_SET_ACTUAL_ARRIVAL_DATE,
  CONTAINER_SET_AGREE_ARRIVAL_DATE,
  CONTAINER_SET_DEPARTURE_DATE,
  CONTAINER_SET_NO,
  CONTAINER_SET_YARD_NAME,
  CONTAINER_UPDATE,
  CONTAINER_SET_CONTAINER_TYPE,
} from 'modules/permission/constants/container';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_SET_ARCHIVED,
  SHIPMENT_SET_NO,
  SHIPMENT_SET_BL_NO,
  SHIPMENT_SET_BL_DATE,
  SHIPMENT_SET_BOOKING_NO,
  SHIPMENT_SET_BOOKING_DATE,
  SHIPMENT_SET_INVOICE_NO,
  SHIPMENT_SET_CONTRACT_NO,
  SHIPMENT_SET_CARRIER,
  SHIPMENT_SET_DOCUMENTS,
  SHIPMENT_SET_REVISE_TIMELINE_DATE,
  SHIPMENT_SET_TIMELINE_DATE,
  SHIPMENT_SET_TRANSPORT_TYPE,
  SHIPMENT_SET_LOAD_TYPE,
  SHIPMENT_SET_INCOTERM,
} from 'modules/permission/constants/shipment';

function transformShipment(basePath: string, shipment: Object): Array<CellValue> {
  return [
    {
      columnKey: 'shipment.created',
      type: 'date_user',
      ...transformComputedField(basePath, shipment, 'created', item => {
        return item
          ? {
              at: new Date(item.createdAt),
              by: item.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, shipment, 'createdBy', shipment?.createdBy ?? null),
    },
    {
      columnKey: 'shipment.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, shipment, 'createdAt', shipment?.createdAt ?? null),
    },
    {
      columnKey: 'shipment.updated',
      type: 'date_user',
      ...transformComputedField(basePath, shipment, 'updated', item => {
        return item
          ? {
              at: new Date(item.updatedAt),
              by: item.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, shipment, 'updatedBy', shipment?.updatedBy ?? null),
    },
    {
      columnKey: 'shipment.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, shipment, 'updatedAt', shipment?.updatedAt ?? null),
    },
    {
      columnKey: 'shipment.archived',
      type: 'status',
      ...transformValueField(
        basePath,
        shipment,
        'archived',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_ARCHIVED)
      ),
    },
    {
      columnKey: 'shipment.no',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'no',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_NO)
      ),
    },
    {
      columnKey: 'shipment.blNo',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'blNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_NO)
      ),
    },
    {
      columnKey: 'shipment.blDate',
      type: 'date',
      ...transformValueField(
        basePath,
        shipment,
        'blDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BL_DATE)
      ),
    },
    {
      columnKey: 'shipment.bookingNo',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'bookingNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_NO)
      ),
    },
    {
      columnKey: 'shipment.bookingDate',
      type: 'date',
      ...transformValueField(
        basePath,
        shipment,
        'bookingDate',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_BOOKING_DATE)
      ),
    },
    {
      columnKey: 'shipment.invoiceNo',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'invoiceNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INVOICE_NO)
      ),
    },
    {
      columnKey: 'shipment.contractNo',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'contractNo',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CONTRACT_NO)
      ),
    },
    {
      columnKey: 'shipment.transportType',
      type: 'transport_type',
      ...transformValueField(
        basePath,
        shipment,
        'transportType',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TRANSPORT_TYPE)
      ),
    },
    {
      columnKey: 'shipment.loadType',
      type: 'load_type',
      ...transformValueField(
        basePath,
        shipment,
        'loadType',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_LOAD_TYPE)
      ),
    },
    {
      columnKey: 'shipment.incoterm',
      type: 'incoterm',
      ...transformValueField(
        basePath,
        shipment,
        'incoterm',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_INCOTERM)
      ),
    },
    {
      columnKey: 'shipment.carrier',
      type: 'text',
      ...transformValueField(
        basePath,
        shipment,
        'carrier',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_CARRIER)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.cargoReady`,
        shipment?.cargoReady ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.cargoReady.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.cargoReady`,
        shipment?.cargoReady ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroups.customClearance.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.containerGroups.0.customClearance`,
        shipment?.containerGroups?.[0]?.customClearance ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroups.customClearance.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.containerGroups.0.customClearance`,
        shipment?.containerGroups?.[0]?.customClearance ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroups.warehouseArrival.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroups.warehouseArrival.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.containerGroups.0.warehouseArrival`,
        shipment?.containerGroups?.[0]?.warehouseArrival ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroups.deliveryReady.date',
      type: 'date',
      ...transformValueField(
        `${basePath}.containerGroups.0.deliveryReady`,
        shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'date',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.containerGroups.deliveryReady.timelineDateRevisions',
      type: 'date_revisions',
      ...transformValueField(
        `${basePath}.containerGroups.0.deliveryReady`,
        shipment?.containerGroups?.[0]?.deliveryReady ?? null,
        'timelineDateRevisions',
        hasPermission =>
          hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_REVISE_TIMELINE_DATE)
      ),
    },
    {
      columnKey: 'shipment.files',
      type: 'shipment_documents',
      ...transformValueField(
        basePath,
        shipment,
        'files',
        hasPermission => hasPermission(SHIPMENT_UPDATE) || hasPermission(SHIPMENT_SET_DOCUMENTS)
      ),
    },
  ].map(c => ({
    ...c,
    empty: !shipment,
    parent: true,
  }));
}

function transformContainer(
  basePath: string,
  container: Object,
  hasContainers: boolean
): Array<CellValue> {
  return [
    {
      columnKey: 'shipment.container.created',
      type: 'date_user',
      ...transformComputedField(basePath, container, 'created', item => {
        const currentContainer = item.containers.find(c => c.id === container?.id);

        return currentContainer
          ? {
              at: new Date(currentContainer?.createdAt),
              by: currentContainer?.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.container.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'createdBy', container?.createdBy ?? null),
    },
    {
      columnKey: 'shipment.container.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'createdAt', container?.createdAt ?? null),
    },
    {
      columnKey: 'shipment.container.updated',
      type: 'date_user',
      ...transformComputedField(basePath, container, 'updated', item => {
        const currentContainer = item.containers.find(c => c.id === container?.id);

        return currentContainer
          ? {
              at: new Date(currentContainer?.updatedAt),
              by: currentContainer?.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.container.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'updatedBy', container?.updatedBy ?? null),
    },
    {
      columnKey: 'shipment.container.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, container, 'updatedAt', container?.updatedAt ?? null),
    },
    {
      columnKey: 'shipment.container.archived',
      type: 'status',
      ...transformComputedField(basePath, container, 'archived', item => {
        return item.archived ?? true;
      }),
    },
    {
      columnKey: 'shipment.container.no',
      type: 'text',
      ...transformValueField(
        basePath,
        container,
        'no',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_NO)
      ),
    },
    {
      columnKey: 'shipment.container.containerType',
      type: 'container_type',
      ...transformValueField(
        basePath,
        container,
        'containerType',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_CONTAINER_TYPE)
      ),
    },
    {
      columnKey: 'shipment.container.warehouseArrivalAgreedDate',
      type: 'datetime',
      ...transformValueField(
        basePath,
        container,
        'warehouseArrivalAgreedDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_AGREE_ARRIVAL_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.warehouseArrivalActualDate',
      type: 'datetime',
      ...transformValueField(
        basePath,
        container,
        'warehouseArrivalActualDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_ACTUAL_ARRIVAL_DATE)
      ),
    },
    // start date
    {
      columnKey: 'shipment.container.yardName',
      type: 'text',
      ...transformValueField(
        basePath,
        container,
        'yardName',
        hasPermission => hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_YARD_NAME)
      ),
    },
    {
      columnKey: 'shipment.container.departureDate',
      type: 'date',
      ...transformValueField(
        basePath,
        container,
        'departureDate',
        hasPermission =>
          hasPermission(CONTAINER_UPDATE) || hasPermission(CONTAINER_SET_DEPARTURE_DATE)
      ),
    },
  ].map(c => ({
    ...c,
    disabled: !hasContainers && !container,
    empty: hasContainers && !container,
    parent: true,
  }));
}

function transformBatch(basePath: string, batch: Object): Array<CellValue> {
  return [
    {
      columnKey: 'shipment.container.batch.created',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'created', item => {
        const currentBatch = [
          ...item.batchesWithoutContainer,
          ...item.containers.map(c => c.batches).flat(),
        ].find(b => b.id === batch?.id);

        return currentBatch
          ? {
              at: new Date(currentBatch.createdAt),
              by: currentBatch.createdBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.container.batch.createdBy',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'createdBy', batch?.createdBy ?? null),
    },
    {
      columnKey: 'shipment.container.batch.createdAt',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'createdAt', batch?.createdAt ?? null),
    },
    {
      columnKey: 'shipment.container.batch.updated',
      type: 'date_user',
      ...transformComputedField(basePath, batch, 'updated', item => {
        const currentBatch = [
          ...item.batchesWithoutContainer,
          ...item.containers.map(c => c.batches).flat(),
        ].find(b => b.id === batch?.id);

        return currentBatch
          ? {
              at: new Date(currentBatch.updatedAt),
              by: currentBatch.updatedBy,
            }
          : null;
      }),
    },
    {
      columnKey: 'shipment.container.batch.updatedBy',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'updatedBy', batch?.updatedBy ?? null),
    },
    {
      columnKey: 'shipment.container.batch.updatedAt',
      type: 'text',
      ...transformReadonlyField(basePath, batch, 'updatedAt', batch?.updatedAt ?? null),
    },
    {
      columnKey: 'shipment.container.batch.archived',
      type: 'status',
      disabled: !batch,
      parent: true,
      ...transformComputedField(basePath, batch, 'archived', item => {
        const currentBatch = [
          ...item.batchesWithoutContainer,
          ...item.containers.map(c => c.batches).flat(),
        ].find(b => b.id === batch?.id);

        return item.archived && currentBatch.orderItem.order.archived;
      }),
    },
    {
      columnKey: 'shipment.container.batch.no',
      type: 'text',
      ...transformValueField(
        basePath,
        batch,
        'no',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_NO)
      ),
    },
    {
      columnKey: 'shipment.container.batch.deliveredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'deliveredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_DELIVERY_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.desiredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'desiredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_DESIRED_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.expiredAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'expiredAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_EXPIRY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.producedAt',
      type: 'date',
      ...transformValueField(
        basePath,
        batch,
        'producedAt',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PRODUCTION_DATE)
      ),
    },
    {
      columnKey: 'shipment.container.batch.quantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'quantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.quantityRevisions',
      type: 'quantity_revisions',
      ...transformValueField(
        basePath,
        batch,
        'batchQuantityRevisions',
        hasPermission =>
          hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_QUANTITY_ADJUSTMENTS)
      ),
    },
    {
      columnKey: 'shipment.container.batch.packageName',
      type: 'text',
      ...transformValueField(
        basePath,
        batch,
        'packageName',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_NAME)
      ),
    },
    {
      columnKey: 'shipment.container.batch.packageCapacity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'packageCapacity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_CAPACITY)
      ),
    },
    {
      columnKey: 'shipment.container.batch.packageQuantity',
      type: 'number',
      ...transformValueField(
        basePath,
        batch,
        'packageQuantity',
        hasPermission => hasPermission(BATCH_UPDATE) || hasPermission(BATCH_SET_PACKAGE_QUANTITY)
      ),
    },
  ].map(c => ({
    ...c,
    disabled: !batch,
  }));
}

/*
function transformBatchOrderItem(basePath: string, batch: Object): Array<CellValue> {
  return [].map(c => ({
    ...c,
  }));
}

function transformBatchOrderItemOrder(basePath: string, batch: Object): Array<CellValue> {
  return [].map(c => ({
    ...c,
  }));
}
*/

export default function transformer(index: number, shipment: Object): Array<Array<CellValue>> {
  const rows = [];

  let shipmentCells = transformShipment(`${index}`, shipment);

  shipment.batchesWithoutContainer.forEach((batch, batchIdx) => {
    rows.push([
      ...shipmentCells,
      ...transformContainer(`${index}.containers.-1`, null, false),
      ...transformBatch(`${index}.batchesWithoutContainer.${batchIdx}`, batch),
      // ...transformBatchOrderItem(`${index}.batchesWithoutContainer.${batchIdx}`, batch),
      // ...transformBatchOrderItemOrder(`${index}.batchesWithoutContainer.${batchIdx}`, batch),
    ]);

    shipmentCells = transformShipment(`${index}`, null);
  });

  if (shipment.containers.length > 0) {
    shipment.containers.forEach((container, containerIdx) => {
      let containerCells = transformContainer(
        `${index}.containers.${containerIdx}`,
        container,
        true
      );

      if (container.batches.length > 0) {
        container.batches.forEach((batch, batchIdx) => {
          rows.push([
            ...shipmentCells,
            ...containerCells,
            ...transformBatch(`${index}.containers.${containerIdx}.batches.${batchIdx}`, batch),
            // ...transformBatchOrderItem(
            //  `${index}.containers.${containerIdx}.batches.${batchIdx}`,
            //  batch
            // ),
            // ...transformBatchOrderItemOrder(
            //   `${index}.containers.${containerIdx}.batches.${batchIdx}`,
            //   batch
            // ),
          ]);

          containerCells = transformContainer(`${index}.containers.${containerIdx}`, null, true);
          shipmentCells = transformShipment(`${index}`, null);
        });
      } else {
        rows.push([
          ...shipmentCells,
          ...containerCells,
          ...transformBatch(`${index}.containers.${containerIdx}.batches.-1`, null),
          // ...transformBatchOrderItem(`${index}.containers.${containerIdx}.batches.-1`, null),
          // ...transformBatchOrderItemOrder(`${index}.containers.${containerIdx}.batches.-1`, null),
        ]);

        shipmentCells = transformShipment(`${index}`, null);
      }
    });
  } else if (shipment.batchesWithoutContainer.length === 0) {
    rows.push([
      ...shipmentCells,
      ...transformContainer(`${index}.containers.-1`, null, false),
      ...transformBatch(`${index}.containers.-1.batches.-1`, null),
      // ...transformBatchOrderItem(`${index}.containers.-1.batches.-1`, null),
      // ...transformBatchOrderItemOrder(`${index}.containers.-1.batches.-1`, null),
    ]);
  }

  return rows;
}
