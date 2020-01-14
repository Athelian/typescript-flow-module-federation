// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import productColumns from 'modules/sheet/product/columns';
import productProviderColumns from 'modules/sheet/productProvider/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import batchColumns from 'modules/sheet/batch/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';

export const FieldDefinitionEntityTypes = [
  'Order',
  'OrderItem',
  'Batch',
  'Shipment',
  'Product',
  'ProductProvider',
];

export const BatchSheetColumnGroups = [
  'BATCH',
  'ORDER_ITEM',
  'PRODUCT',
  'PRODUCT_PROVIDER',
  'ORDER',
  'CONTAINER',
  'SHIPMENT',
];

type Props = {|
  columnsKeys: Array<string>,
  orderFieldDefinitions: Array<FieldDefinition>,
  productFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
|};

export default function({
  columnsKeys,
  orderFieldDefinitions,
  productFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
}: Props): Array<ColumnConfig> {
  return [
    ...batchColumns({
      columnsKeys,
      exportKeys: {
        'batch.created': ['createdAt', 'createdBy'],
        'batch.updated': ['updatedAt', 'updatedBy'],
        'batch.archived': 'archived',
        'batch.no': 'no',
        'batch.deliveredAt': 'deliveredAt',
        'batch.desiredAt': 'desiredAt',
        'batch.expiredAt': 'expiredAt',
        'batch.producedAt': 'producedAt',
        'batch.tags': 'tags',
        'batch.memo': 'memo',
        'batch.latestQuantity': 'latestQuantity',
        'batch.differenceQuantity': 'differenceQuantity',
        'batch.quantity': 'quantity',
        'batch.producedQuantity': 'producedQuantity',
        'batch.preShippedQuantity': 'preShippedQuantity',
        'batch.shippedQuantity': 'shippedQuantity',
        'batch.postShippedQuantity': 'postShippedQuantity',
        'batch.deliveredQuantity': 'deliveredQuantity',
        'batch.packageName': 'packageName',
        'batch.packageCapacity': 'packageCapacity',
        'batch.packageQuantity': 'packageQuantity',
        'batch.packageGrossWeight': ['packageGrossWeight.value', 'packageGrossWeight.metric'],
        'batch.packageVolume': ['packageVolume.value', 'packageVolume.metric'],
        'batch.packageSize': [
          'packageSize.length.value',
          'packageSize.length.metric',
          'packageSize.width.value',
          'packageSize.width.metric',
          'packageSize.height.value',
          'packageSize.height.metric',
        ],
        'batch.todo': [
          'todo.taskCount.count',
          'todo.taskCount.remain',
          'todo.taskCount.inProgress',
          'todo.taskCount.completed',
          'todo.taskCount.rejected',
          'todo.taskCount.approved',
          'todo.taskCount.skipped',
          'todo.taskCount.delayed',
        ],
        'batch.customField': 'customFields',
      },
      sorts: {
        'batch.created': {
          name: 'createdAt',
          group: 'batch',
        },
        'batch.updated': {
          default: true,
          name: 'updatedAt',
          group: 'batch',
        },
        'batch.no': {
          name: 'no',
          group: 'batch',
        },
        'batch.deliveredAt': {
          name: 'deliveredAt',
          group: 'batch',
        },
        'batch.expiredAt': {
          name: 'expiredAt',
          group: 'batch',
        },
        'batch.producedAt': {
          name: 'producedAt',
          group: 'batch',
        },
        'batch.desiredAt': {
          name: 'desiredAt',
          group: 'batch',
        },
      },
      fieldDefinitions: batchFieldDefinitions,
    }).filter(c => !['batch.action'].includes(c.key)),
    ...orderItemColumns({
      columnsKeys,
      exportKeys: {
        'orderItem.created': ['orderItem.createdAt', 'orderItem.createdBy'],
        'orderItem.updated': ['orderItem.updatedAt', 'orderItem.updatedBy'],
        'orderItem.archived': 'orderItem.archived',
        'orderItem.no': 'orderItem.no',
        'orderItem.quantity': 'orderItem.quantity',
        'orderItem.price': ['orderItem.price.amount', 'orderItem.price.currency'],
        'orderItem.deliveryDate': 'orderItem.deliveryDate',
        'orderItem.tags': 'orderItem.tags',
        'orderItem.memo': 'orderItem.memo',
        'orderItem.files': 'orderItem.files', // TODO
        'orderItem.todo': [
          'orderItem.todo.taskCount.count',
          'orderItem.todo.taskCount.remain',
          'orderItem.todo.taskCount.inProgress',
          'orderItem.todo.taskCount.completed',
          'orderItem.todo.taskCount.rejected',
          'orderItem.todo.taskCount.approved',
          'orderItem.todo.taskCount.skipped',
          'orderItem.todo.taskCount.delayed',
        ],
        'orderItem.customField': 'orderItem.customFields',
      },
      fieldDefinitions: orderItemFieldDefinitions,
    }).filter(
      c =>
        ![
          'orderItem.remainQuantity',
          'orderItem.totalBatched',
          'orderItem.remainingBatchedQuantity',
          'orderItem.totalShipped',
          'orderItem.remainingShippedQuantity',
          'orderItem.totalPrice',
          'orderItem.action',
        ].includes(c.key)
    ),
    ...productColumns({
      columnsKeys,
      exportKeys: {
        'product.name': 'orderItem.productProvider.product.name',
        'product.serial': 'orderItem.productProvider.product.serial',
        'product.material': 'orderItem.productProvider.product.material',
        'product.customField': 'orderItem.productProvider.product.customFields',
      },
      fieldDefinitions: productFieldDefinitions,
    }),
    ...productProviderColumns({
      columnsKeys,
      exportKeys: {
        'productProvider.supplier': 'orderItem.productProvider.supplier.name',
        'productProvider.name': 'orderItem.productProvider.name',
        'productProvider.unitPrice': [
          'orderItem.productProvider.unitPrice.amount',
          'orderItem.productProvider.unitPrice.currency',
        ],
      },
    }),
    ...orderColumns({
      columnsKeys,
      exportKeys: {
        'order.created': ['orderItem.order.createdAt', 'orderItem.order.createdBy'],
        'order.updated': ['orderItem.order.updatedAt', 'orderItem.order.updatedBy'],
        'order.archived': 'orderItem.order.archived',
        'order.poNo': 'orderItem.order.poNo',
        'order.importer': 'orderItem.order.importer.name',
        'order.exporter': 'orderItem.order.exporter.name',
        'order.piNo': 'orderItem.order.piNo',
        'order.issuedAt': 'orderItem.order.issuedAt',
        'order.deliveryDate': 'orderItem.order.deliveryDate',
        'order.currency': 'orderItem.order.currency',
        'order.incoterm': 'orderItem.order.incoterm',
        'order.deliveryPlace': 'orderItem.order.deliveryPlace',
        'order.tags': 'orderItem.order.tags',
        'order.memo': 'orderItem.order.memo',
        'order.inCharges': 'orderItem.order.inCharges',
        'order.files': 'orderItem.order.files', // TODO
        'order.todo': [
          'orderItem.order.todo.taskCount.count',
          'orderItem.order.todo.taskCount.remain',
          'orderItem.order.todo.taskCount.inProgress',
          'orderItem.order.todo.taskCount.completed',
          'orderItem.order.todo.taskCount.rejected',
          'orderItem.order.todo.taskCount.approved',
          'orderItem.order.todo.taskCount.skipped',
          'orderItem.order.todo.taskCount.delayed',
        ],
        'order.customField': 'orderItem.order.customFields',
      },
      fieldDefinitions: orderFieldDefinitions,
    }).filter(
      c =>
        ![
          'order.totalOrdered',
          'order.totalBatched',
          'order.totalShipped',
          'order.totalPrice',
          'order.action',
        ].includes(c.key)
    ),
    ...containerColumns({
      columnsKeys,
      exportKeys: {
        'container.created': ['container.createdAt', 'container.createdBy'],
        'container.updated': ['container.updatedAt', 'container.updatedBy'],
        'container.archived': 'container.archived',
        'container.no': 'container.no',
        'container.containerType': 'container.containerType',
        'container.containerOption': 'container.containerOption',
        'container.warehouseArrivalAgreedDate': 'container.warehouseArrivalAgreedDate',
        'container.warehouseArrivalAgreedDateAssignedTo':
          'container.warehouseArrivalAgreedDateAssignedTo',
        'container.warehouseArrivalAgreedDateApproved': [
          'container.warehouseArrivalAgreedDateApprovedAt',
          'container.warehouseArrivalAgreedDateApprovedBy',
        ],
        'container.warehouseArrivalActualDate': 'container.warehouseArrivalActualDate',
        'container.warehouseArrivalActualDateAssignedTo':
          'container.warehouseArrivalActualDateAssignedTo',
        'container.warehouseArrivalActualDateApproved': [
          'container.warehouseArrivalActualDateApprovedAt',
          'container.warehouseArrivalActualDateApprovedBy',
        ],
        'container.warehouse': 'container.warehouse.name',
        'container.freeTime': 'container.freeTime',
        'container.freeTimeStartDate': 'container.freeTimeStartDate',
        'container.freeTimeDuration': 'container.freeTimeDuration',
        'container.dueDate': 'container.dueDate',
        'container.yardName': 'container.yardName',
        'container.departureDate': 'container.departureDate',
        'container.departureDateAssignedTo': 'container.departureDateAssignedTo',
        'container.departureDateApproved': [
          'container.departureDateApprovedAt',
          'container.departureDateApprovedBy',
        ],
        'container.tags': 'container.tags',
        'container.memo': 'container.memo',
      },
    }).filter(
      c =>
        ![
          'container.totalPrice',
          'container.totalBatchQuantity',
          'container.totalItems',
          'container.totalPackages',
          'container.totalWeight',
          'container.totalVolume',
        ].includes(c.key)
    ),
    ...shipmentColumns({
      columnsKeys,
      exportKeys: {
        'shipment.created': ['shipment.createdAt', 'shipment.createdBy'],
        'shipment.updated': ['shipment.updatedAt', 'shipment.updatedBy'],
        'shipment.archived': 'shipment.archived',
        'shipment.no': 'shipment.no',
        'shipment.importer': 'shipment.importer.name',
        'shipment.exporter': 'shipment.exporter.name',
        'shipment.forwarders': 'shipment.forwarders',
        'shipment.blNo': 'shipment.blNo',
        'shipment.blDate': 'shipment.blDate',
        'shipment.booked': 'shipment.booked',
        'shipment.bookingNo': 'shipment.bookingNo',
        'shipment.bookingDate': 'shipment.bookingDate',
        'shipment.invoiceNo': 'shipment.invoiceNo',
        'shipment.contractNo': 'shipment.contractNo',
        'shipment.transportType': 'shipment.transportType',
        'shipment.loadType': 'shipment.loadType',
        'shipment.incoterm': 'shipment.incoterm',
        'shipment.carrier': 'shipment.carrier',
        'shipment.tags': 'shipment.tags',
        'shipment.memo': 'shipment.memo',
        'shipment.inCharges': 'shipment.inCharges',
        'shipment.numOfVoyages': 'shipment.numOfVoyages',
        'shipment.cargoReady.date': 'shipment.cargoReady.date',
        'shipment.cargoReady.latestDate': 'shipment.cargoReady.latestDate',
        'shipment.cargoReady.dateDifference': 'shipment.cargoReady.dateDifference',
        'shipment.cargoReady.assignedTo': 'shipment.cargoReady.assignedTo',
        'shipment.cargoReady.approved': [
          'shipment.cargoReady.approvedAt',
          'shipment.cargoReady.approvedBy',
        ],
        'shipment.voyage.0.departurePort': 'shipment.voyage_1.departurePort',
        'shipment.voyage.0.departure.date': 'shipment.voyage_1.departure.date',
        'shipment.voyage.0.departure.latestDate': 'shipment.voyage_1.departure.latestDate',
        'shipment.voyage.0.departure.dateDifference': 'shipment.voyage_1.departure.dateDifference',
        'shipment.voyage.0.departure.assignedTo': 'shipment.voyage_1.departure.assignedTo',
        'shipment.voyage.0.departure.approved': [
          'shipment.voyage_1.departure.approvedAt',
          'shipment.voyage_1.departure.approvedBy',
        ],
        'shipment.voyage.0.vesselName': 'shipment.voyage_1.vesselName',
        'shipment.voyage.0.vesselCode': 'shipment.voyage_1.vesselCode',
        'shipment.voyage.0.firstTransitPort': 'shipment.voyage_1.arrivalPort',
        'shipment.voyage.0.firstTransitArrival.date': 'shipment.voyage_1.arrival.date',
        'shipment.voyage.0.firstTransitArrival.latestDate': 'shipment.voyage_1.arrival.latestDate',
        'shipment.voyage.0.firstTransitArrival.dateDifference':
          'shipment.voyage_1.arrival.dateDifference',
        'shipment.voyage.0.firstTransitArrival.assignedTo': 'shipment.voyage_1.arrival.assignedTo',
        'shipment.voyage.0.firstTransitArrival.approved': [
          'shipment.voyage_1.arrival.approvedAt',
          'shipment.voyage_1.arrival.approvedBy',
        ],
        'shipment.voyage.1.firstTransitDeparture.date': 'shipment.voyage_2.departure.date',
        'shipment.voyage.1.firstTransitDeparture.latestDate':
          'shipment.voyage_2.departure.latestDate',
        'shipment.voyage.1.firstTransitDeparture.dateDifference':
          'shipment.voyage_2.departure.dateDifference',
        'shipment.voyage.1.firstTransitDeparture.assignedTo':
          'shipment.voyage_2.departure.assignedTo',
        'shipment.voyage.1.firstTransitDeparture.approved': [
          'shipment.voyage_2.departure.approvedAt',
          'shipment.voyage_2.departure.approvedBy',
        ],
        'shipment.voyage.1.vesselName': 'shipment.voyage_2.vesselName',
        'shipment.voyage.1.vesselCode': 'shipment.voyage_2.vesselCode',
        'shipment.voyage.1.secondTransitPort': 'shipment.voyage_2.departurePort',
        'shipment.voyage.1.secondTransitArrival.date': 'shipment.voyage_2.arrival.date',
        'shipment.voyage.1.secondTransitArrival.latestDate': 'shipment.voyage_2.arrival.latestDate',
        'shipment.voyage.1.secondTransitArrival.dateDifference':
          'shipment.voyage_2.arrival.dateDifference',
        'shipment.voyage.1.secondTransitArrival.assignedTo': 'shipment.voyage_2.arrival.assignedTo',
        'shipment.voyage.1.secondTransitArrival.approved': [
          'shipment.voyage_2.arrival.approvedAt',
          'shipment.voyage_2.arrival.approvedBy',
        ],
        'shipment.voyage.2.secondTransitDeparture.date': 'shipment.voyage_3.departure.date',
        'shipment.voyage.2.secondTransitDeparture.latestDate':
          'shipment.voyage_3.departure.latestDate',
        'shipment.voyage.2.secondTransitDeparture.dateDifference':
          'shipment.voyage_3.departure.dateDifference',
        'shipment.voyage.2.secondTransitDeparture.assignedTo':
          'shipment.voyage_3.departure.assignedTo',
        'shipment.voyage.2.secondTransitDeparture.approved': [
          'shipment.voyage_3.departure.approvedAt',
          'shipment.voyage_3.departure.approvedBy',
        ],
        'shipment.voyage.2.vesselName': 'shipment.voyage_3.vesselName',
        'shipment.voyage.2.vesselCode': 'shipment.voyage_3.vesselCode',
        'shipment.voyage.2.arrivalPort': 'shipment.voyage_3.arrivalPort',
        'shipment.voyage.2.arrival.date': 'shipment.voyage_3.arrival.date',
        'shipment.voyage.2.arrival.latestDate': 'shipment.voyage_3.arrival.latestDate',
        'shipment.voyage.2.arrival.dateDifference': 'shipment.voyage_3.arrival.dateDifference',
        'shipment.voyage.2.arrival.assignedTo': 'shipment.voyage_3.arrival.assignedTo',
        'shipment.voyage.2.arrival.approved': [
          'shipment.voyage_3.arrival.approvedAt',
          'shipment.voyage_3.arrival.approvedBy',
        ],
        'shipment.containerGroup.customClearance.date':
          'shipment.containerGroup.customClearance.date',
        'shipment.containerGroup.customClearance.latestDate':
          'shipment.containerGroup.customClearance.latestDate',
        'shipment.containerGroup.customClearance.dateDifference':
          'shipment.containerGroup.customClearance.dateDifference',
        'shipment.containerGroup.customClearance.assignedTo':
          'shipment.containerGroup.customClearance.assignedTo',
        'shipment.containerGroup.customClearance.approved': [
          'shipment.containerGroup.customClearance.approvedAt',
          'shipment.containerGroup.customClearance.approvedBy',
        ],
        'shipment.containerGroup.warehouse': 'shipment.containerGroup.warehouse.name',
        'shipment.containerGroup.warehouseArrival.date':
          'shipment.containerGroup.warehouseArrival.date',
        'shipment.containerGroup.warehouseArrival.latestDate':
          'shipment.containerGroup.warehouseArrival.latestDate',
        'shipment.containerGroup.warehouseArrival.dateDifference':
          'shipment.containerGroup.warehouseArrival.dateDifference',
        'shipment.containerGroup.warehouseArrival.assignedTo':
          'shipment.containerGroup.warehouseArrival.assignedTo',
        'shipment.containerGroup.warehouseArrival.approved': [
          'shipment.containerGroup.warehouseArrival.approvedAt',
          'shipment.containerGroup.warehouseArrival.approvedBy',
        ],
        'shipment.containerGroup.deliveryReady.date': 'shipment.containerGroup.deliveryReady.date',
        'shipment.containerGroup.deliveryReady.assignedTo':
          'shipment.containerGroup.deliveryReady.assignedTo',
        'shipment.containerGroup.deliveryReady.approved': [
          'shipment.containerGroup.deliveryReady.approvedAt',
          'shipment.containerGroup.deliveryReady.approvedBy',
        ],
        'shipment.files': 'shipment.files', // TODO
        'shipment.todo': [
          'shipment.todo.taskCount.count',
          'shipment.todo.taskCount.remain',
          'shipment.todo.taskCount.inProgress',
          'shipment.todo.taskCount.completed',
          'shipment.todo.taskCount.rejected',
          'shipment.todo.taskCount.approved',
          'shipment.todo.taskCount.skipped',
          'shipment.todo.taskCount.delayed',
        ],
        'shipment.customField': 'shipment.customFields',
      },
      fieldDefinitions: shipmentFieldDefinitions,
    }).filter(
      c =>
        ![
          'shipment.relatedExporters',
          'shipment.totalBatchQuantity',
          'shipment.totalPrice',
          'shipment.totalWeight',
          'shipment.totalPackages',
          'shipment.totalProducts',
          'shipment.totalOrders',
          'shipment.totalBatches',
          'shipment.totalContainers',
        ].includes(c.key)
    ),
  ];
}
