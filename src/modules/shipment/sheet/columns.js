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
        'shipment.created': ['shipment.createdAt', 'shipment.createdBy'],
        'shipment.updated': ['shipment.updatedAt', 'shipment.updatedBy'],
        'shipment.cargoReady.approved': [
          'shipment.cargoReady.approvedAt',
          'shipment.cargoReady.approvedBy',
        ],
        'shipment.voyage.0.departurePort': 'shipment.voyage_1.departurePort',
        'shipment.voyage.0.departure.latestDate': 'shipment.voyage_1.departure.latestDate',
        'shipment.voyage.0.departure.dateDifference': 'shipment.voyage_1.departure.dateDifference',
        'shipment.voyage.0.departure.date': 'shipment.voyage_1.departure.date',
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
        'shipment.voyage.0.firstTransitArrival.approved': [
          'shipment.voyage_1.arrival.approvedAt',
          'shipment.voyage_1.arrival.approvedBy',
        ],
        'shipment.voyage.1.firstTransitDeparture.date': 'shipment.voyage_2.departure.date',
        'shipment.voyage.1.firstTransitDeparture.latestDate':
          'shipment.voyage_2.departure.latestDate',
        'shipment.voyage.1.firstTransitDeparture.dateDifference':
          'shipment.voyage_2.departure.dateDifference',
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
        'shipment.voyage.1.secondTransitArrival.approved': [
          'shipment.voyage_2.arrival.approvedAt',
          'shipment.voyage_2.arrival.approvedBy',
        ],
        'shipment.voyage.2.secondTransitDeparture.date': 'shipment.voyage_3.departure.date',
        'shipment.voyage.2.secondTransitDeparture.latestDate':
          'shipment.voyage_3.departure.latestDate',
        'shipment.voyage.2.secondTransitDeparture.dateDifference':
          'shipment.voyage_3.departure.dateDifference',
        'shipment.voyage.2.secondTransitDeparture.approved': [
          'shipment.voyage_3.departure.approvedAt',
          'shipment.voyage_3.departure.approvedBy',
        ],
        'shipment.voyage.2.vesselName': 'shipment.voyage_3.vesselName',
        'shipment.voyage.2.vesselCode': 'shipment.voyage_3.vesselCode',
        'shipment.voyage.2.arrivalPort': 'shipment.voyage_3.arrivalPort',
        'shipment.voyage.2.arrival.date': 'shipment.voyage_3.arrival.date',
        'shipment.voyage.2.arrival.approved': [
          'shipment.voyage_3.arrival.approvedAt',
          'shipment.voyage_3.arrival.approvedBy',
        ],
        'shipment.containerGroup.customClearance.approved': [
          'shipment.containerGroup.customClearance.approvedAt',
          'shipment.containerGroup.customClearance.approvedBy',
        ],
        'shipment.containerGroup.warehouseArrival.approved': [
          'shipment.containerGroup.warehouseArrival.approvedAt',
          'shipment.containerGroup.warehouseArrival.approvedBy',
        ],
        'shipment.containerGroup.deliveryReady.approved': [
          'shipment.containerGroup.deliveryReady.approvedAt',
          'shipment.containerGroup.deliveryReady.approvedBy',
        ],
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
        'container.created': ['container.createdAt', 'container.createdBy'],
        'container.updated': ['container.updatedAt', 'container.updatedBy'],
        'container.warehouseArrivalAgreedDateApproved': [
          'container.warehouseArrivalAgreedDateApprovedAt',
          'container.warehouseArrivalAgreedDateApprovedBy',
        ],
        'container.warehouseArrivalActualDateApproved': [
          'container.warehouseArrivalActualDateApprovedAt',
          'container.warehouseArrivalActualDateApprovedBy',
        ],
        'container.departureDateApproved': [
          'container.departureDateApprovedAt',
          'container.departureDateApprovedBy',
        ],
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
        'batch.created': ['batch.createdAt', 'batch.createdBy'],
        'batch.updated': ['batch.updatedAt', 'batch.updatedBy'],
        'batch.packageGrossWeight': [
          'batch.packageGrossWeight.value',
          'batch.packageGrossWeight.metric',
        ],
        'batch.packageVolume': ['batch.packageVolume.value', 'batch.packageVolume.metric'],
        'batch.packageSize': [
          'batch.packageSize.length.value',
          'batch.packageSize.length.metric',
          'batch.packageSize.width.value',
          'batch.packageSize.width.metric',
          'batch.packageSize.height.value',
          'batch.packageSize.height.metric',
        ],
        'batch.todo': [
          'batch.todo.taskCount.count',
          'batch.todo.taskCount.remain',
          'batch.todo.taskCount.inProgress',
          'batch.todo.taskCount.completed',
          'batch.todo.taskCount.rejected',
          'batch.todo.taskCount.approved',
          'batch.todo.taskCount.skipped',
          'batch.todo.taskCount.delayed',
        ],
        'batch.customField': 'batch.customFields',
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
        'orderItem.created': ['orderItem.createdAt', 'orderItem.createdBy'],
        'orderItem.updated': ['orderItem.updatedAt', 'orderItem.updatedBy'],
        'orderItem.price': ['orderItem.price.amount', 'orderItem.price.currency'],
        'orderItem.totalPrice': ['orderItem.totalPrice.amount', 'orderItem.totalPrice.currency'],
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
      exportKeys: {
        'product.customField': 'product.customFields',
      },
      fieldDefinitions: productFieldDefinitions,
    }),
    ...productProviderColumns({
      exportKeys: {
        'productProvider.unitPrice': [
          'productProvider.unitPrice.amount',
          'productProvider.unitPrice.currency',
        ],
      },
    }),
    ...orderColumns({
      exportKeys: {
        'order.created': ['order.createdAt', 'order.createdBy'],
        'order.updated': ['order.updatedAt', 'order.updatedBy'],
        'order.totalPrice': ['order.totalPrice.amount', 'order.totalPrice.currency'],
        'order.todo': [
          'order.todo.taskCount.count',
          'order.todo.taskCount.remain',
          'order.todo.taskCount.inProgress',
          'order.todo.taskCount.completed',
          'order.todo.taskCount.rejected',
          'order.todo.taskCount.approved',
          'order.todo.taskCount.skipped',
          'order.todo.taskCount.delayed',
        ],
        'order.customField': 'order.customFields',
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
