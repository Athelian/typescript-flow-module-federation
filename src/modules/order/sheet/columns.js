// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import batchColumns from 'modules/sheet/batch/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';
import productColumns from 'modules/sheet/product/columns';
import productProviderColumns from 'modules/sheet/productProvider/columns';

export const FieldDefinitionEntityTypes = [
  'Order',
  'Product',
  'ProductProvider',
  'OrderItem',
  'Batch',
  'Shipment',
];

export const OrderSheetColumnGroups = [
  'ORDER',
  'PRODUCT',
  'PRODUCT_PROVIDER',
  'ORDER_ITEM',
  'BATCH',
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
    ...orderColumns({
      columnsKeys,
      exportKeys: {
        'order.created': ['createdAt', 'createdBy'],
        'order.updated': ['updatedAt', 'updatedBy'],
        'order.archived': 'archived',
        'order.poNo': 'poNo',
        'order.importer': 'importer.name',
        'order.exporter': 'exporter.name',
        'order.piNo': 'piNo',
        'order.issuedAt': 'issuedAt',
        'order.deliveryDate': 'deliveryDate',
        'order.currency': 'currency',
        'order.incoterm': 'incoterm',
        'order.deliveryPlace': 'deliveryPlace',
        'order.tags': 'tags',
        'order.memo': 'memo',
        'order.inCharges': 'inCharges',
        'order.totalOrdered': 'totalOrdered',
        'order.totalBatched': 'totalBatched',
        'order.totalShipped': 'totalShipped',
        'order.totalPrice': ['totalPrice.amount', 'totalPrice.currency'],
        'order.files': 'files', // TODO
        'order.todo': [
          'todo.taskCount.count',
          'todo.taskCount.remain',
          'todo.taskCount.inProgress',
          'todo.taskCount.completed',
          'todo.taskCount.rejected',
          'todo.taskCount.approved',
          'todo.taskCount.skipped',
          'todo.taskCount.delayed',
        ],
        'order.customField': 'customFields',
      },
      sort: {
        'order.created': {
          name: 'createdAt',
          group: 'order',
        },
        'order.updated': {
          default: true,
          name: 'updatedAt',
          group: 'order',
        },
        'order.poNo': {
          name: 'poNo',
          group: 'order',
        },
        'order.piNo': {
          name: 'piNo',
          group: 'order',
        },
        'order.currency': {
          name: 'currency',
          group: 'order',
        },
      },
      fieldDefinitions: orderFieldDefinitions,
    }),
    ...productColumns({
      columnsKeys,
      exportKeys: {
        'product.name': 'orderItems.productProvider.product.name',
        'product.serial': 'orderItems.productProvider.product.serial',
        'product.material': 'orderItems.productProvider.product.material',
        'product.customField': 'orderItems.productProvider.product.customFields',
      },
      fieldDefinitions: productFieldDefinitions,
    }),
    ...productProviderColumns({
      columnsKeys,
      exportKeys: {
        'productProvider.supplier': 'orderItems.productProvider.supplier.name',
        'productProvider.name': 'orderItems.productProvider.name',
        'productProvider.unitPrice': [
          'orderItems.productProvider.unitPrice.amount',
          'orderItems.productProvider.unitPrice.currency',
        ],
      },
    }),
    ...orderItemColumns({
      columnsKeys,
      exportKeys: {
        'orderItem.created': ['orderItems.createdAt', 'orderItems.createdBy'],
        'orderItem.updated': ['orderItems.updatedAt', 'orderItems.updatedBy'],
        'orderItem.archived': 'orderItems.archived',
        'orderItem.no': 'orderItems.no',
        'orderItem.quantity': 'orderItems.quantity',
        'orderItem.price': ['orderItems.price.amount', 'orderItems.price.currency'],
        'orderItem.deliveryDate': 'orderItems.deliveryDate',
        'orderItem.tags': 'orderItems.tags',
        'orderItem.memo': 'orderItems.memo',
        'orderItem.totalBatched': 'orderItems.totalBatched',
        'orderItem.remainingBatchedQuantity': 'orderItems.remainingBatchedQuantity',
        'orderItem.totalShipped': 'orderItems.totalShipped',
        'orderItem.remainingShippedQuantity': 'orderItems.remainingShippedQuantity',
        'orderItem.totalPrice': ['orderItems.totalPrice.amount', 'orderItems.totalPrice.currency'],
        'orderItem.files': 'orderItems.files', // TODO
        'orderItem.todo': [
          'orderItems.todo.taskCount.count',
          'orderItems.todo.taskCount.remain',
          'orderItems.todo.taskCount.inProgress',
          'orderItems.todo.taskCount.completed',
          'orderItems.todo.taskCount.rejected',
          'orderItems.todo.taskCount.approved',
          'orderItems.todo.taskCount.skipped',
          'orderItems.todo.taskCount.delayed',
        ],
        'orderItem.customField': 'orderItems.customFields',
      },
      sorts: {
        'orderItem.created': {
          local: true,
          default: true,
          name: 'createdAt',
          group: 'orderItem',
        },
        'orderItem.updated': {
          local: true,
          name: 'updatedAt',
          group: 'orderItem',
        },
        'orderItem.no': {
          local: true,
          name: 'no',
          group: 'orderItem',
        },
        'orderItem.quantity': {
          local: true,
          name: 'quantity',
          group: 'orderItem',
        },
        'orderItem.price': {
          local: true,
          name: 'price',
          group: 'orderItem',
        },
        'orderItem.deliveryDate': {
          local: true,
          name: 'deliveryDate',
          group: 'orderItem',
        },
        'orderItem.totalBatched': {
          local: true,
          name: 'totalBatched',
          group: 'orderItem',
        },
        'orderItem.remainingBatchedQuantity': {
          local: true,
          name: 'remainingBatchedQuantity',
          group: 'orderItem',
        },
        'orderItem.totalShipped': {
          local: true,
          name: 'totalShipped',
          group: 'orderItem',
        },
        'orderItem.remainingShippedQuantity': {
          local: true,
          name: 'remainingShippedQuantity',
          group: 'orderItem',
        },
      },
      fieldDefinitions: orderItemFieldDefinitions,
    }),
    ...batchColumns({
      columnsKeys,
      exportKeys: {
        'batch.created': ['orderItems.batches.createdAt', 'orderItems.batches.createdBy'],
        'batch.updated': ['orderItems.batches.updatedAt', 'orderItems.batches.updatedBy'],
        'batch.archived': 'orderItems.batches.archived',
        'batch.no': 'orderItems.batches.no',
        'batch.deliveredAt': 'orderItems.batches.deliveredAt',
        'batch.desiredAt': 'orderItems.batches.desiredAt',
        'batch.expiredAt': 'orderItems.batches.expiredAt',
        'batch.producedAt': 'orderItems.batches.producedAt',
        'batch.tags': 'orderItems.batches.tags',
        'batch.memo': 'orderItems.batches.memo',
        'batch.latestQuantity': 'orderItems.batches.latestQuantity',
        'batch.differenceQuantity': 'orderItems.batches.differenceQuantity',
        'batch.quantity': 'orderItems.batches.quantity',
        'batch.producedQuantity': 'orderItems.batches.producedQuantity',
        'batch.preShippedQuantity': 'orderItems.batches.preShippedQuantity',
        'batch.shippedQuantity': 'orderItems.batches.shippedQuantity',
        'batch.postShippedQuantity': 'orderItems.batches.postShippedQuantity',
        'batch.deliveredQuantity': 'orderItems.batches.deliveredQuantity',
        'batch.packageName': 'orderItems.batches.packageName',
        'batch.packageCapacity': 'orderItems.batches.packageCapacity',
        'batch.packageQuantity': 'orderItems.batches.packageQuantity',
        'batch.packageGrossWeight': [
          'orderItems.batches.packageGrossWeight.value',
          'orderItems.batches.packageGrossWeight.metric',
        ],
        'batch.packageVolume': [
          'orderItems.batches.packageVolume.value',
          'orderItems.batches.packageVolume.metric',
        ],
        'batch.packageSize': [
          'orderItems.batches.packageSize.length.value',
          'orderItems.batches.packageSize.length.metric',
          'orderItems.batches.packageSize.width.value',
          'orderItems.batches.packageSize.width.metric',
          'orderItems.batches.packageSize.height.value',
          'orderItems.batches.packageSize.height.metric',
        ],
        'batch.todo': [
          'orderItems.batches.todo.taskCount.count',
          'orderItems.batches.todo.taskCount.remain',
          'orderItems.batches.todo.taskCount.inProgress',
          'orderItems.batches.todo.taskCount.completed',
          'orderItems.batches.todo.taskCount.rejected',
          'orderItems.batches.todo.taskCount.approved',
          'orderItems.batches.todo.taskCount.skipped',
          'orderItems.batches.todo.taskCount.delayed',
        ],
        'batch.customField': 'orderItems.batches.customFields',
      },
      sorts: {
        'batch.created': {
          local: true,
          default: true,
          name: 'createdAt',
          group: 'batch',
        },
        'batch.updated': {
          local: true,
          name: 'updatedAt',
          group: 'batch',
        },
        'batch.no': {
          local: true,
          name: 'no',
          group: 'batch',
        },
        'batch.deliveredAt': {
          local: true,
          name: 'deliveredAt',
          group: 'batch',
        },
        'batch.desiredAt': {
          local: true,
          name: 'desiredAt',
          group: 'batch',
        },
        'batch.expiredAt': {
          local: true,
          name: 'expiredAt',
          group: 'batch',
        },
        'batch.producedAt': {
          local: true,
          name: 'producedAt',
          group: 'batch',
        },
        'batch.quantity': {
          local: true,
          name: 'quantity',
          group: 'batch',
        },
        'batch.packageName': {
          local: true,
          name: 'packageName',
          group: 'batch',
        },
        'batch.packageCapacity': {
          local: true,
          name: 'packageCapacity',
          group: 'batch',
        },
        'batch.packageQuantity': {
          local: true,
          name: 'packageQuantity',
          group: 'batch',
        },
      },
      fieldDefinitions: batchFieldDefinitions,
    }),
    ...containerColumns({
      columnsKeys,
      exportKeys: {
        'container.created': [
          'orderItems.batches.container.createdAt',
          'orderItems.batches.container.createdBy',
        ],
        'container.updated': [
          'orderItems.batches.container.updatedAt',
          'orderItems.batches.container.updatedBy',
        ],
        'container.archived': 'orderItems.batches.container.archived',
        'container.no': 'orderItems.batches.container.no',
        'container.containerType': 'orderItems.batches.container.containerType',
        'container.containerOption': 'orderItems.batches.container.containerOption',
        'container.warehouseArrivalAgreedDate':
          'orderItems.batches.container.warehouseArrivalAgreedDate',
        'container.warehouseArrivalAgreedDateAssignedTo':
          'orderItems.batches.container.warehouseArrivalAgreedDateAssignedTo',
        'container.warehouseArrivalAgreedDateApproved': [
          'orderItems.batches.container.warehouseArrivalAgreedDateApprovedAt',
          'orderItems.batches.container.warehouseArrivalAgreedDateApprovedBy',
        ],
        'container.warehouseArrivalActualDate':
          'orderItems.batches.container.warehouseArrivalActualDate',
        'container.warehouseArrivalActualDateAssignedTo':
          'orderItems.batches.container.warehouseArrivalActualDateAssignedTo',
        'container.warehouseArrivalActualDateApproved': [
          'orderItems.batches.container.warehouseArrivalActualDateApprovedAt',
          'orderItems.batches.container.warehouseArrivalActualDateApprovedBy',
        ],
        'container.warehouse': 'orderItems.batches.container.warehouse.name',
        'container.freeTime': 'orderItems.batches.container.freeTime',
        'container.freeTimeStartDate': 'orderItems.batches.container.freeTimeStartDate',
        'container.freeTimeDuration': 'orderItems.batches.container.freeTimeDuration',
        'container.dueDate': 'orderItems.batches.container.dueDate',
        'container.yardName': 'orderItems.batches.container.yardName',
        'container.departureDate': 'orderItems.batches.container.departureDate',
        'container.departureDateAssignedTo': 'orderItems.batches.container.departureDateAssignedTo',
        'container.departureDateApproved': [
          'orderItems.batches.container.departureDateApprovedAt',
          'orderItems.batches.container.departureDateApprovedBy',
        ],
        'container.tags': 'orderItems.batches.container.tags',
        'container.memo': 'orderItems.batches.container.memo',
      },
      sorts: {
        'container.created': {
          local: true,
          name: 'containerCreateAt',
          group: 'batch',
        },
        'container.updated': {
          local: true,
          name: 'containerUpdatedAt',
          group: 'batch',
        },
        'container.no': {
          local: true,
          name: 'containerNo',
          group: 'batch',
        },
        'container.warehouseArrivalAgreedDate': {
          local: true,
          name: 'containerWarehouseArrivalAgreedDate',
          group: 'batch',
        },
        'container.warehouseArrivalActualDate': {
          local: true,
          name: 'containerWarehouseArrivalActualDate',
          group: 'batch',
        },
        'container.yardName': {
          local: true,
          name: 'containerYardName',
          group: 'batch',
        },
        'container.departureDate': {
          local: true,
          name: 'containerDepartureDate',
          group: 'batch',
        },
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
        'shipment.created': [
          'orderItems.batches.shipment.createdAt',
          'orderItems.batches.shipment.createdBy',
        ],
        'shipment.updated': [
          'orderItems.batches.shipment.updatedAt',
          'orderItems.batches.shipment.updatedBy',
        ],
        'shipment.archived': 'orderItems.batches.shipment.archived',
        'shipment.no': 'orderItems.batches.shipment.no',
        'shipment.importer': 'orderItems.batches.shipment.importer.name',
        'shipment.exporter': 'orderItems.batches.shipment.exporter.name',
        'shipment.forwarders': 'orderItems.batches.shipment.forwarders',
        'shipment.blNo': 'orderItems.batches.shipment.blNo',
        'shipment.blDate': 'orderItems.batches.shipment.blDate',
        'shipment.booked': 'orderItems.batches.shipment.booked',
        'shipment.bookingNo': 'orderItems.batches.shipment.bookingNo',
        'shipment.bookingDate': 'orderItems.batches.shipment.bookingDate',
        'shipment.invoiceNo': 'orderItems.batches.shipment.invoiceNo',
        'shipment.contractNo': 'orderItems.batches.shipment.contractNo',
        'shipment.transportType': 'orderItems.batches.shipment.transportType',
        'shipment.loadType': 'orderItems.batches.shipment.loadType',
        'shipment.incoterm': 'orderItems.batches.shipment.incoterm',
        'shipment.carrier': 'orderItems.batches.shipment.carrier',
        'shipment.tags': 'orderItems.batches.shipment.tags',
        'shipment.memo': 'orderItems.batches.shipment.memo',
        'shipment.inCharges': 'orderItems.batches.shipment.inCharges',
        'shipment.numOfVoyages': 'orderItems.batches.shipment.numOfVoyages',
        'shipment.cargoReady.date': 'orderItems.batches.shipment.cargoReady.date',
        'shipment.cargoReady.latestDate': 'orderItems.batches.shipment.cargoReady.latestDate',
        'shipment.cargoReady.dateDifference':
          'orderItems.batches.shipment.cargoReady.dateDifference',
        'shipment.cargoReady.assignedTo': 'orderItems.batches.shipment.cargoReady.assignedTo',
        'shipment.cargoReady.approved': [
          'orderItems.batches.shipment.cargoReady.approvedAt',
          'orderItems.batches.shipment.cargoReady.approvedBy',
        ],
        'shipment.voyage.0.departurePort': 'orderItems.batches.shipment.voyage_1.departurePort',
        'shipment.voyage.0.departure.latestDate':
          'orderItems.batches.shipment.voyage_1.departure.latestDate',
        'shipment.voyage.0.departure.dateDifference':
          'orderItems.batches.shipment.voyage_1.departure.dateDifference',
        'shipment.voyage.0.departure.date': 'orderItems.batches.shipment.voyage_1.departure.date',
        'shipment.voyage.0.departure.assignedTo':
          'orderItems.batches.shipment.voyage_1.departure.assignedTo',
        'shipment.voyage.0.departure.approved': [
          'orderItems.batches.shipment.voyage_1.departure.approvedAt',
          'orderItems.batches.shipment.voyage_1.departure.approvedBy',
        ],
        'shipment.voyage.0.vesselName': 'orderItems.batches.shipment.voyage_1.vesselName',
        'shipment.voyage.0.vesselCode': 'orderItems.batches.shipment.voyage_1.vesselCode',
        'shipment.voyage.0.firstTransitPort': 'orderItems.batches.shipment.voyage_1.arrivalPort',
        'shipment.voyage.0.firstTransitArrival.date':
          'orderItems.batches.shipment.voyage_1.arrival.date',
        'shipment.voyage.0.firstTransitArrival.latestDate':
          'orderItems.batches.shipment.voyage_1.arrival.latestDate',
        'shipment.voyage.0.firstTransitArrival.dateDifference':
          'orderItems.batches.shipment.voyage_1.arrival.dateDifference',
        'shipment.voyage.0.firstTransitArrival.assignedTo':
          'orderItems.batches.shipment.voyage_1.arrival.assignedTo',
        'shipment.voyage.0.firstTransitArrival.approved': [
          'orderItems.batches.shipment.voyage_1.arrival.approvedAt',
          'orderItems.batches.shipment.voyage_1.arrival.approvedBy',
        ],
        'shipment.voyage.1.firstTransitDeparture.date':
          'orderItems.batches.shipment.voyage_2.departure.date',
        'shipment.voyage.1.firstTransitDeparture.latestDate':
          'orderItems.batches.shipment.voyage_2.departure.latestDate',
        'shipment.voyage.1.firstTransitDeparture.dateDifference':
          'orderItems.batches.shipment.voyage_2.departure.dateDifference',
        'shipment.voyage.1.firstTransitDeparture.assignedTo':
          'orderItems.batches.shipment.voyage_2.departure.assignedTo',
        'shipment.voyage.1.firstTransitDeparture.approved': [
          'orderItems.batches.shipment.voyage_2.departure.approvedAt',
          'orderItems.batches.shipment.voyage_2.departure.approvedBy',
        ],
        'shipment.voyage.1.vesselName': 'orderItems.batches.shipment.voyage_2.vesselName',
        'shipment.voyage.1.vesselCode': 'orderItems.batches.shipment.voyage_2.vesselCode',
        'shipment.voyage.1.secondTransitPort': 'orderItems.batches.shipment.voyage_2.departurePort',
        'shipment.voyage.1.secondTransitArrival.date':
          'orderItems.batches.shipment.voyage_2.arrival.date',
        'shipment.voyage.1.secondTransitArrival.latestDate':
          'orderItems.batches.shipment.voyage_2.arrival.latestDate',
        'shipment.voyage.1.secondTransitArrival.dateDifference':
          'orderItems.batches.shipment.voyage_2.arrival.dateDifference',
        'shipment.voyage.1.secondTransitArrival.assignedTo':
          'orderItems.batches.shipment.voyage_2.arrival.assignedTo',
        'shipment.voyage.1.secondTransitArrival.approved': [
          'orderItems.batches.shipment.voyage_2.arrival.approvedAt',
          'orderItems.batches.shipment.voyage_2.arrival.approvedBy',
        ],
        'shipment.voyage.2.secondTransitDeparture.date':
          'orderItems.batches.shipment.voyage_3.departure.date',
        'shipment.voyage.2.secondTransitDeparture.latestDate':
          'orderItems.batches.shipment.voyage_3.departure.latestDate',
        'shipment.voyage.2.secondTransitDeparture.dateDifference':
          'orderItems.batches.shipment.voyage_3.departure.dateDifference',
        'shipment.voyage.2.secondTransitDeparture.assignedTo':
          'orderItems.batches.shipment.voyage_3.departure.assignedTo',
        'shipment.voyage.2.secondTransitDeparture.approved': [
          'orderItems.batches.shipment.voyage_3.departure.approvedAt',
          'orderItems.batches.shipment.voyage_3.departure.approvedBy',
        ],
        'shipment.voyage.2.vesselName': 'orderItems.batches.shipment.voyage_3.vesselName',
        'shipment.voyage.2.vesselCode': 'orderItems.batches.shipment.voyage_3.vesselCode',
        'shipment.voyage.2.arrivalPort': 'orderItems.batches.shipment.voyage_3.arrivalPort',
        'shipment.voyage.2.arrival.date': 'orderItems.batches.shipment.voyage_3.arrival.date',
        'shipment.voyage.2.arrival.assignedTo':
          'orderItems.batches.shipment.voyage_3.arrival.assignedTo',
        'shipment.voyage.2.arrival.approved': [
          'orderItems.batches.shipment.voyage_3.arrival.approvedAt',
          'orderItems.batches.shipment.voyage_3.arrival.approvedBy',
        ],
        'shipment.containerGroup.customClearance.date':
          'orderItems.batches.shipment.containerGroup.customClearance.date',
        'shipment.containerGroup.customClearance.latestDate':
          'orderItems.batches.shipment.containerGroup.customClearance.latestDate',
        'shipment.containerGroup.customClearance.dateDifference':
          'orderItems.batches.shipment.containerGroup.customClearance.dateDifference',
        'shipment.containerGroup.customClearance.assignedTo':
          'orderItems.batches.shipment.containerGroup.customClearance.assignedTo',
        'shipment.containerGroup.customClearance.approved': [
          'orderItems.batches.shipment.containerGroup.customClearance.approvedAt',
          'orderItems.batches.shipment.containerGroup.customClearance.approvedBy',
        ],
        'shipment.containerGroup.warehouse':
          'orderItems.batches.shipment.containerGroup.warehouse.name',
        'shipment.containerGroup.warehouseArrival.date':
          'orderItems.batches.shipment.containerGroup.warehouseArrival.date',
        'shipment.containerGroup.warehouseArrival.latestDate':
          'orderItems.batches.shipment.containerGroup.warehouseArrival.latestDate',
        'shipment.containerGroup.warehouseArrival.dateDifference':
          'orderItems.batches.shipment.containerGroup.warehouseArrival.dateDifference',
        'shipment.containerGroup.warehouseArrival.assignedTo':
          'orderItems.batches.shipment.containerGroup.warehouseArrival.assignedTo',
        'shipment.containerGroup.warehouseArrival.approved': [
          'orderItems.batches.shipment.containerGroup.warehouseArrival.approvedAt',
          'orderItems.batches.shipment.containerGroup.warehouseArrival.approvedBy',
        ],
        'shipment.containerGroup.deliveryReady.date':
          'orderItems.batches.shipment.containerGroup.deliveryReady.date',
        'shipment.containerGroup.deliveryReady.latestDate':
          'orderItems.batches.shipment.containerGroup.deliveryReady.latestDate',
        'shipment.containerGroup.deliveryReady.dateDifference':
          'orderItems.batches.shipment.containerGroup.deliveryReady.dateDifference',
        'shipment.containerGroup.deliveryReady.assignedTo':
          'orderItems.batches.shipment.containerGroup.deliveryReady.assignedTo',
        'shipment.containerGroup.deliveryReady.approved': [
          'orderItems.batches.shipment.containerGroup.deliveryReady.approvedAt',
          'orderItems.batches.shipment.containerGroup.deliveryReady.approvedBy',
        ],
        'shipment.files': 'orderItems.batches.shipment.files', // TODO
        'shipment.todo': [
          'orderItems.batches.shipment.todo.taskCount.count',
          'orderItems.batches.shipment.todo.taskCount.remain',
          'orderItems.batches.shipment.todo.taskCount.inProgress',
          'orderItems.batches.shipment.todo.taskCount.completed',
          'orderItems.batches.shipment.todo.taskCount.rejected',
          'orderItems.batches.shipment.todo.taskCount.approved',
          'orderItems.batches.shipment.todo.taskCount.skipped',
          'orderItems.batches.shipment.todo.taskCount.delayed',
        ],
        'shipment.customField': 'orderItems.batches.shipment.customFields',
      },
      sorts: {
        'shipment.created': {
          local: true,
          name: 'shipmentCreatedAt',
          group: 'batch',
        },
        'shipment.updated': {
          local: true,
          name: 'shipmentUpdatedAt',
          group: 'batch',
        },
        'shipment.no': {
          local: true,
          name: 'shipmentNo',
          group: 'batch',
        },
        'shipment.blNo': {
          local: true,
          name: 'shipmentBlNo',
          group: 'batch',
        },
        'shipment.blDate': {
          local: true,
          name: 'shipmentBlDate',
          group: 'batch',
        },
        'shipment.bookingNo': {
          local: true,
          name: 'shipmentBookingNo',
          group: 'batch',
        },
        'shipment.bookingDate': {
          local: true,
          name: 'shipmentBookingDate',
          group: 'batch',
        },
        'shipment.invoiceNo': {
          local: true,
          name: 'shipmentInvoiceNo',
          group: 'batch',
        },
        'shipment.contractNo': {
          local: true,
          name: 'shipmentContractNo',
          group: 'batch',
        },
        'shipment.carrier': {
          local: true,
          name: 'shipmentCarrier',
          group: 'batch',
        },
        'shipment.numOfVoyages': {
          local: true,
          name: 'shipmentNumOfVoyages',
          group: 'batch',
        },
      },
      fieldDefinitions: shipmentFieldDefinitions,
    }).filter(
      c =>
        ![
          'shipment.relatedExporters',
          'shipment.totalBatchQuantity',
          'shipment.totalPrice',
          'shipment.totalVolume',
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
