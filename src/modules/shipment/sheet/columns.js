// @flow
import type { FieldDefinition } from 'types';
import type { ColumnConfig } from 'components/Sheet';
import orderColumns from 'modules/sheet/order/columns';
import orderItemColumns from 'modules/sheet/orderItem/columns';
import shipmentColumns from 'modules/sheet/shipment/columns';
import containerColumns from 'modules/sheet/container/columns';
import batchColumns from 'modules/sheet/batch/columns';
import productColumns from 'modules/sheet/product/columns';
import productProviderColumns from 'modules/sheet/productProvider/columns';

export const FieldDefinitionEntityTypes = [
  'Order',
  'OrderItem',
  'Batch',
  'Shipment',
  'Product',
  'ProductProvider',
];

export const ShipmentSheetColumnGroups = [
  'SHIPMENT',
  'CONTAINER',
  'BATCH',
  'ORDER_ITEM',
  'PRODUCT',
  'PRODUCT_PROVIDER',
  'ORDER',
];

type Props = {|
  orderFieldDefinitions: Array<FieldDefinition>,
  orderItemFieldDefinitions: Array<FieldDefinition>,
  batchFieldDefinitions: Array<FieldDefinition>,
  shipmentFieldDefinitions: Array<FieldDefinition>,
  productFieldDefinitions: Array<FieldDefinition>,
|};

export default function({
  orderFieldDefinitions,
  orderItemFieldDefinitions,
  batchFieldDefinitions,
  shipmentFieldDefinitions,
  productFieldDefinitions,
}: Props): Array<ColumnConfig> {
  return [
    ...shipmentColumns({
      exportKeys: {
        'shipment.created': ['createdAt', 'createdBy'],
        'shipment.updated': ['updatedAt', 'updatedBy'],
        'shipment.archived': 'archived',
        'shipment.no': 'no',
        'shipment.importer': 'importer.name',
        'shipment.exporter': 'exporter.name',
        'shipment.forwarders': 'forwarders',
        'shipment.relatedExporters': 'relatedExporters',
        'shipment.blNo': 'blNo',
        'shipment.blDate': 'blDate',
        'shipment.booked': 'booked',
        'shipment.bookingNo': 'bookingNo',
        'shipment.bookingDate': 'bookingDate',
        'shipment.invoiceNo': 'invoiceNo',
        'shipment.contractNo': 'contractNo',
        'shipment.transportType': 'transportType',
        'shipment.loadType': 'loadType',
        'shipment.incoterm': 'incoterm',
        'shipment.carrier': 'carrier',
        'shipment.tags': 'tags',
        'shipment.memo': 'memo',
        'shipment.totalBatchQuantity': 'totalBatchQuantity',
        'shipment.totalPrice': ['totalPrice.amount', 'totalPrice.currency'],
        'shipment.totalProducts': 'productCount',
        'shipment.totalOrders': 'orderCount',
        'shipment.totalBatches': 'batchCount',
        'shipment.totalContainers': 'containerCount',
        'shipment.totalPackages': 'totalPackageQuantity',
        'shipment.totalWeight': ['totalWeight.value', 'totalWeight.metric'],
        'shipment.totalVolume': ['totalVolume.value', 'totalVolume.metric'],
        'shipment.numOfVoyages': 'numOfVoyages',
        'shipment.cargoReady.date': 'cargoReady.date',
        'shipment.cargoReady.latestDate': 'cargoReady.latestDate',
        'shipment.cargoReady.dateDifference': 'cargoReady.dateDifference',
        'shipment.cargoReady.approved': ['cargoReady.approvedAt', 'cargoReady.approvedBy'],
        'shipment.voyage.0.departurePort': 'voyage_1.departurePort',
        'shipment.voyage.0.departure.date': 'voyage_1.departure.date',
        'shipment.voyage.0.departure.latestDate': 'voyage_1.departure.latestDate',
        'shipment.voyage.0.departure.dateDifference': 'voyage_1.departure.dateDifference',
        'shipment.voyage.0.departure.approved': [
          'voyage_1.departure.approvedAt',
          'voyage_1.departure.approvedBy',
        ],
        'shipment.voyage.0.vesselName': 'voyage_1.vesselName',
        'shipment.voyage.0.vesselCode': 'voyage_1.vesselCode',
        'shipment.voyage.0.firstTransitPort': 'voyage_1.arrivalPort',
        'shipment.voyage.0.firstTransitArrival.date': 'voyage_1.arrival.date',
        'shipment.voyage.0.firstTransitArrival.latestDate': 'voyage_1.arrival.latestDate',
        'shipment.voyage.0.firstTransitArrival.dateDifference': 'voyage_1.arrival.dateDifference',
        'shipment.voyage.0.firstTransitArrival.approved': [
          'voyage_1.arrival.approvedAt',
          'voyage_1.arrival.approvedBy',
        ],
        'shipment.voyage.1.firstTransitDeparture.date': 'voyage_2.departure.date',
        'shipment.voyage.1.firstTransitDeparture.latestDate': 'voyage_2.departure.latestDate',
        'shipment.voyage.1.firstTransitDeparture.dateDifference':
          'voyage_2.departure.dateDifference',
        'shipment.voyage.1.firstTransitDeparture.approved': [
          'voyage_2.departure.approvedAt',
          'voyage_2.departure.approvedBy',
        ],
        'shipment.voyage.1.vesselName': 'voyage_2.vesselName',
        'shipment.voyage.1.vesselCode': 'voyage_2.vesselCode',
        'shipment.voyage.1.secondTransitPort': 'voyage_2.departurePort',
        'shipment.voyage.1.secondTransitArrival.date': 'voyage_2.arrival.date',
        'shipment.voyage.1.secondTransitArrival.latestDate': 'voyage_2.arrival.latestDate',
        'shipment.voyage.1.secondTransitArrival.dateDifference': 'voyage_2.arrival.dateDifference',
        'shipment.voyage.1.secondTransitArrival.approved': [
          'voyage_2.arrival.approvedAt',
          'voyage_2.arrival.approvedBy',
        ],
        'shipment.voyage.2.secondTransitDeparture.date': 'voyage_3.departure.date',
        'shipment.voyage.2.secondTransitDeparture.latestDate': 'voyage_3.departure.latestDate',
        'shipment.voyage.2.secondTransitDeparture.dateDifference':
          'voyage_3.departure.dateDifference',
        'shipment.voyage.2.secondTransitDeparture.approved': [
          'voyage_3.departure.approvedAt',
          'voyage_3.departure.approvedBy',
        ],
        'shipment.voyage.2.vesselName': 'voyage_3.vesselName',
        'shipment.voyage.2.vesselCode': 'voyage_3.vesselCode',
        'shipment.voyage.2.arrivalPort': 'voyage_3.arrivalPort',
        'shipment.voyage.2.arrival.date': 'voyage_3.arrival.date',
        'shipment.voyage.2.arrival.latestDate': 'voyage_3.arrival.latestDate',
        'shipment.voyage.2.arrival.dateDifference': 'voyage_3.arrival.dateDifference',
        'shipment.voyage.2.arrival.approved': [
          'voyage_3.arrival.approvedAt',
          'voyage_3.arrival.approvedBy',
        ],
        'shipment.containerGroup.customClearance.date': 'containerGroup.customClearance.date',
        'shipment.containerGroup.customClearance.latestDate':
          'containerGroup.customClearance.latestDate',
        'shipment.containerGroup.customClearance.dateDifference':
          'containerGroup.customClearance.dateDifference',
        'shipment.containerGroup.customClearance.approved': [
          'containerGroup.customClearance.approvedAt',
          'containerGroup.customClearance.approvedBy',
        ],
        'shipment.containerGroup.warehouse': 'containerGroup.warehouse.name',
        'shipment.containerGroup.warehouseArrival.date': 'containerGroup.warehouseArrival.date',
        'shipment.containerGroup.warehouseArrival.latestDate':
          'containerGroup.warehouseArrival.latestDate',
        'shipment.containerGroup.warehouseArrival.dateDifference':
          'containerGroup.warehouseArrival.dateDifference',
        'shipment.containerGroup.warehouseArrival.approved': [
          'containerGroup.warehouseArrival.approvedAt',
          'containerGroup.warehouseArrival.approvedBy',
        ],
        'shipment.containerGroup.deliveryReady.date': 'containerGroup.deliveryReady.date',
        'shipment.containerGroup.deliveryReady.latestDate':
          'containerGroup.deliveryReady.latestDate',
        'shipment.containerGroup.deliveryReady.dateDifference':
          'containerGroup.deliveryReady.dateDifference',
        'shipment.containerGroup.deliveryReady.approved': [
          'containerGroup.deliveryReady.approvedAt',
          'containerGroup.deliveryReady.approvedBy',
        ],
        'shipment.files': 'files', // TODO
        'shipment.todo': [
          'todo.taskCount.count',
          'todo.taskCount.remain',
          'todo.taskCount.inProgress',
          'todo.taskCount.completed',
          'todo.taskCount.rejected',
          'todo.taskCount.approved',
          'todo.taskCount.skipped',
          'todo.taskCount.delayed',
        ],
        'shipment.customField': 'customFields',
      },
      sorts: {
        'shipment.created': {
          name: 'createdAt',
          group: 'shipment',
        },
        'shipment.updated': {
          name: 'updatedAt',
          group: 'shipment',
        },
        'shipment.no': {
          name: 'no',
          group: 'shipment',
        },
        'shipment.blNo': {
          name: 'blNo',
          group: 'shipment',
        },
        'shipment.cargoReady.date': {
          name: 'cargoReady',
          group: 'shipment',
        },
        'shipment.voyage.0.departure.date': {
          name: 'loadPortDeparture',
          group: 'shipment',
        },
        'shipment.voyage.0.firstTransitArrival.date': {
          name: 'firstTransitPortArrival',
          group: 'shipment',
        },
        'shipment.voyage.1.firstTransitDeparture.date': {
          name: 'firstTransitPortDeparture',
          group: 'shipment',
        },
        'shipment.voyage.1.secondTransitArrival.date': {
          name: 'secondTransitPortArrival',
          group: 'shipment',
        },
        'shipment.voyage.2.secondTransitDeparture.date': {
          name: 'secondTransitPortDeparture',
          group: 'shipment',
        },
        'shipment.voyage.2.arrival.date': {
          name: 'dischargePortArrival',
          group: 'shipment',
        },
        'shipment.containerGroup.customClearance.date': {
          name: 'customClearance',
          group: 'shipment',
        },
        'shipment.containerGroup.warehouseArrival.date': {
          name: 'warehouseArrival',
          group: 'shipment',
        },
        'shipment.containerGroup.deliveryReady.date': {
          name: 'deliveryReady',
          group: 'shipment',
        },
      },
      fieldDefinitions: shipmentFieldDefinitions,
    }),
    ...containerColumns({
      exportKeys: {
        'container.created': ['containers.createdAt', 'containers.createdBy'],
        'container.updated': ['containers.updatedAt', 'containers.updatedBy'],
        'container.archived': 'containers.archived',
        'container.no': 'containers.no',
        'container.containerType': 'containers.containerType',
        'container.containerOption': 'containers.containerOption',
        'container.warehouseArrivalAgreedDate': 'containers.warehouseArrivalAgreedDate',
        'container.warehouseArrivalAgreedDateApproved': [
          'containers.warehouseArrivalAgreedDateApprovedAt',
          'containers.warehouseArrivalAgreedDateApprovedBy',
        ],
        'container.warehouseArrivalActualDate': 'containers.warehouseArrivalActualDate',
        'container.warehouseArrivalActualDateApproved': [
          'containers.warehouseArrivalActualDateApprovedAt',
          'containers.warehouseArrivalActualDateApprovedBy',
        ],
        'container.warehouse': 'containers.warehouse.name',
        'container.freeTime': 'containers.freeTime',
        'container.freeTimeStartDate': 'containers.freeTimeStartDate',
        'container.freeTimeDuration': 'containers.freeTimeDuration',
        'container.dueDate': 'containers.dueDate',
        'container.yardName': 'containers.yardName',
        'container.departureDate': 'containers.departureDate',
        'container.departureDateApproved': [
          'containers.departureDateApprovedAt',
          'containers.departureDateApprovedBy',
        ],
        'container.tags': 'containers.tags',
        'container.memo': 'containers.memo',
        'container.totalPrice': ['containers.totalPrice.amount', 'containers.totalPrice.currency'],
        'container.totalBatchQuantity': 'containers.totalQuantity',
        'container.totalItems': 'containers.orderItemCount',
        'container.totalPackages': 'containers.totalPackageQuantity',
        'container.totalWeight': ['containers.totalWeight.value', 'containers.totalWeight.metric'],
        'container.totalVolume': ['containers.totalVolume.value', 'containers.totalVolume.metric'],
      },
      sorts: {
        'container.created': {
          local: true,
          default: true,
          name: 'createdAt',
          group: 'container',
        },
        'container.updated': {
          local: true,
          name: 'updatedAt',
          group: 'container',
        },
        'container.no': {
          local: true,
          name: 'no',
          group: 'container',
        },
        'container.containerType': {
          local: true,
          name: 'containerType',
          group: 'container',
        },
        'container.warehouseArrivalAgreedDate': {
          local: true,
          name: 'warehouseArrivalAgreedDate',
          group: 'container',
        },
        'container.warehouseArrivalActualDate': {
          local: true,
          name: 'warehouseArrivalActualDate',
          group: 'container',
        },
        'container.freeTimeStartDate': {
          local: true,
          name: 'freeTimeStartDate',
          group: 'container',
        },
        'container.yardName': {
          local: true,
          name: 'yardName',
          group: 'container',
        },
        'container.departureDate': {
          local: true,
          name: 'departureDate',
          group: 'container',
        },
      },
    }),
    ...batchColumns({
      exportKeys: {
        'batch.created': ['containers.batches.createdAt', 'containers.batches.createdBy'],
        'batch.updated': ['containers.batches.updatedAt', 'containers.batches.updatedBy'],
        'batch.archived': 'containers.batches.archived',
        'batch.no': 'containers.batches.no',
        'batch.deliveredAt': 'containers.batches.deliveredAt',
        'batch.desiredAt': 'containers.batches.desiredAt',
        'batch.expiredAt': 'containers.batches.expiredAt',
        'batch.producedAt': 'containers.batches.producedAt',
        'batch.tags': 'containers.batches.tags',
        'batch.memo': 'containers.batches.memo',
        'batch.latestQuantity': 'containers.batches.latestQuantity',
        'batch.differenceQuantity': 'containers.batches.differenceQuantity',
        'batch.quantity': 'containers.batches.quantity',
        'batch.producedQuantity': 'containers.batches.producedQuantity',
        'batch.preShippedQuantity': 'containers.batches.preShippedQuantity',
        'batch.shippedQuantity': 'containers.batches.shippedQuantity',
        'batch.postShippedQuantity': 'containers.batches.postShippedQuantity',
        'batch.deliveredQuantity': 'containers.batches.deliveredQuantity',
        'batch.packageName': 'containers.batches.packageName',
        'batch.packageCapacity': 'containers.batches.packageCapacity',
        'batch.packageQuantity': 'containers.batches.packageQuantity',
        'batch.packageGrossWeight': [
          'containers.batches.packageGrossWeight.value',
          'containers.batches.packageGrossWeight.metric',
        ],
        'batch.packageVolume': [
          'containers.batches.packageVolume.value',
          'containers.batches.packageVolume.metric',
        ],
        'batch.packageSize': [
          'containers.batches.packageSize.length.value',
          'containers.batches.packageSize.length.metric',
          'containers.batches.packageSize.width.value',
          'containers.batches.packageSize.width.metric',
          'containers.batches.packageSize.height.value',
          'containers.batches.packageSize.height.metric',
        ],
        'batch.todo': [
          'containers.batches.todo.taskCount.count',
          'containers.batches.todo.taskCount.remain',
          'containers.batches.todo.taskCount.inProgress',
          'containers.batches.todo.taskCount.completed',
          'containers.batches.todo.taskCount.rejected',
          'containers.batches.todo.taskCount.approved',
          'containers.batches.todo.taskCount.skipped',
          'containers.batches.todo.taskCount.delayed',
        ],
        'batch.customField': 'containers.batches.customFields',
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
    ...orderItemColumns({
      exportKeys: {
        'orderItem.created': [
          'containers.batches.orderItem.createdAt',
          'containers.batches.orderItem.createdBy',
        ],
        'orderItem.updated': [
          'containers.batches.orderItem.updatedAt',
          'containers.batches.orderItem.updatedBy',
        ],
        'orderItem.archived': 'containers.batches.orderItem.archived',
        'orderItem.no': 'containers.batches.orderItem.no',
        'orderItem.quantity': 'containers.batches.orderItem.quantity',
        'orderItem.price': [
          'containers.batches.orderItem.price.amount',
          'containers.batches.orderItem.price.currency',
        ],
        'orderItem.deliveryDate': 'containers.batches.orderItem.deliveryDate',
        'orderItem.tags': 'containers.batches.orderItem.tags',
        'orderItem.memo': 'containers.batches.orderItem.memo',
        'orderItem.files': 'containers.batches.orderItem.files', // TODO
        'orderItem.todo': [
          'containers.batches.orderItem.todo.taskCount.count',
          'containers.batches.orderItem.todo.taskCount.remain',
          'containers.batches.orderItem.todo.taskCount.inProgress',
          'containers.batches.orderItem.todo.taskCount.completed',
          'containers.batches.orderItem.todo.taskCount.rejected',
          'containers.batches.orderItem.todo.taskCount.approved',
          'containers.batches.orderItem.todo.taskCount.skipped',
          'containers.batches.orderItem.todo.taskCount.delayed',
        ],
        'orderItem.customField': 'containers.batches.orderItem.customFields',
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
      exportKeys: {
        'product.name': 'containers.batches.orderItem.productProvider.product.name',
        'product.serial': 'containers.batches.orderItem.productProvider.product.serial',
        'product.material': 'containers.batches.orderItem.productProvider.product.material',
        'product.customField': 'containers.batches.orderItem.productProvider.product.customFields',
      },
      fieldDefinitions: productFieldDefinitions,
    }),
    ...productProviderColumns({
      exportKeys: {
        'productProvider.supplier': 'containers.batches.orderItem.productProvider.supplier.name',
        'productProvider.name': 'containers.batches.orderItem.productProvider.name',
        'productProvider.unitPrice': [
          'containers.batches.orderItem.productProvider.unitPrice.amount',
          'containers.batches.orderItem.productProvider.unitPrice.currency',
        ],
      },
    }),
    ...orderColumns({
      exportKeys: {
        'order.created': [
          'containers.batches.orderItem.order.createdAt',
          'containers.batches.orderItem.order.createdBy',
        ],
        'order.updated': [
          'containers.batches.orderItem.order.updatedAt',
          'containers.batches.orderItem.order.updatedBy',
        ],
        'order.archived': 'containers.batches.orderItem.order.archived',
        'order.poNo': 'containers.batches.orderItem.order.poNo',
        'order.importer': 'containers.batches.orderItem.order.importer.name',
        'order.exporter': 'containers.batches.orderItem.order.exporter.name',
        'order.piNo': 'containers.batches.orderItem.order.piNo',
        'order.issuedAt': 'containers.batches.orderItem.order.issuedAt',
        'order.deliveryDate': 'containers.batches.orderItem.order.deliveryDate',
        'order.currency': 'containers.batches.orderItem.order.currency',
        'order.incoterm': 'containers.batches.orderItem.order.incoterm',
        'order.deliveryPlace': 'containers.batches.orderItem.order.deliveryPlace',
        'order.tags': 'containers.batches.orderItem.order.tags',
        'order.memo': 'containers.batches.orderItem.order.memo',
        'order.files': 'containers.batches.orderItem.order.files', // TODO
        'order.todo': [
          'containers.batches.orderItem.order.todo.taskCount.count',
          'containers.batches.orderItem.order.todo.taskCount.remain',
          'containers.batches.orderItem.order.todo.taskCount.inProgress',
          'containers.batches.orderItem.order.todo.taskCount.completed',
          'containers.batches.orderItem.order.todo.taskCount.rejected',
          'containers.batches.orderItem.order.todo.taskCount.approved',
          'containers.batches.orderItem.order.todo.taskCount.skipped',
          'containers.batches.orderItem.order.todo.taskCount.delayed',
        ],
        'order.customField': 'containers.batches.orderItem.order.customFields',
      },
      fieldDefinition: orderFieldDefinitions,
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
  ];
}
