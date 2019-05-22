// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import { getBatchLatestQuantity, findVolume, findWeight } from 'utils/batch';
import { getLatestDate } from 'utils/shipment';
import { CONTAINER_TYPE_ITEMS } from 'modules/container/constants';
import {
  convertDistance,
  convertVolume,
  convertWeight,
  weightMetrics,
  volumeMetrics,
  distanceMetrics,
} from 'utils/metric';
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
import containerMessages from 'modules/container/messages';
import shipmentMessages from 'modules/shipment/messages';
import productMessages from 'modules/product/messages';
import FormattedNumber from 'components/FormattedNumber';
import { Tooltip } from 'components/Tooltip';
import {
  calculateOrderTotalVolume,
  calculateShipmentTotalVolume,
  calculateShipmentTotalBatchQuantity,
  calculateShipmentTotalPrice,
  calculateContainerTotalPrice,
} from './helpers';

export const orderColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />,
    availableColumns: [
      'order.PO',
      'order.PI',
      'order.date',
      'order.exporterName',
      'order.exporterCode',
      'order.currency',
      'order.incoterm',
      'order.deliveryPlace',
      'order.inCharge',
      'order.tags',
      'order.totalItemQuantity',
      'order.totalPrice',
      'order.totalVolume',
    ],
    columns: [
      <FormattedMessage {...orderMessages.PO} />,
      <FormattedMessage {...orderMessages.PI} />,
      <FormattedMessage {...orderMessages.date} />,
      <FormattedMessage {...orderMessages.exporterName} />,
      <FormattedMessage {...orderMessages.exporterCode} />,
      <FormattedMessage {...orderMessages.currency} />,
      <FormattedMessage {...orderMessages.incoterm} />,
      <FormattedMessage {...orderMessages.deliveryPlace} />,
      <FormattedMessage {...orderMessages.inCharge} />,
      <FormattedMessage {...orderMessages.tags} />,
      <FormattedMessage {...orderMessages.totalItemQuantity} />,
      <FormattedMessage {...orderMessages.totalPrice} />,
      <FormattedMessage {...orderMessages.totalVolume} />,
    ],
  },
];

export const orderItemColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.Items.item" defaultMessage="ITEM" />,
    availableColumns: [
      'orderItem.name',
      'orderItem.serial',
      'orderItem.exporterName',
      'orderItem.exporterCode',
      'orderItem.supplierName',
      'orderItem.supplierCode',
      'orderItem.unitPrice',
      'orderItem.unitPriceCurrency',
      'orderItem.quantity',
      'orderItem.totalPrice',
    ],
    columns: [
      <FormattedMessage id="modules.Products.name" defaultMessage="NAME" />,
      <FormattedMessage id="modules.Products.serial" defaultMessage="SERIAL" />,
      <FormattedMessage
        id="modules.ProductProviders.exporterName"
        defaultMessage="EXPORTER NAME"
      />,
      <FormattedMessage
        id="modules.ProductProviders.exporterCode"
        defaultMessage="EXPORTER CODE"
      />,
      <FormattedMessage
        id="modules.ProductProviders.supplierName"
        defaultMessage="SUPPLIER NAME"
      />,
      <FormattedMessage
        id="modules.ProductProviders.supplierCode"
        defaultMessage="SUPPLIER CODE"
      />,
      <FormattedMessage id="modules.ProductProviders.unitPrice" defaultMessage="UNIT PRICE" />,
      <FormattedMessage
        id="modules.ProductProviders.unitPriceCurrency"
        defaultMessage="UNIT PRICE CURRENCY"
      />,
      <FormattedMessage id="global.quantity" defaultMessage="QUANTITY" />,
      <FormattedMessage {...orderMessages.totalPrice} />,
    ],
  },
];

export const productColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.Products.product" defaultMessage="PRODUCT" />,
    availableColumns: [
      'product.name',
      'product.serial',
      'product.janCode',
      'product.hsCode',
      'product.material',
      'product.tags',
    ],
    columns: [
      <FormattedMessage id="modules.Products.name" defaultMessage="NAME" />,
      <FormattedMessage id="modules.Products.serial" defaultMessage="SERIAL" />,
      <FormattedMessage id="modules.Products.janCode" defaultMessage="JAN CODE" />,
      <FormattedMessage id="modules.Products.hsCode" defaultMessage="HS CODE" />,
      <FormattedMessage id="modules.Products.material" defaultMessage="MATERIAL" />,
      <FormattedMessage id="modules.Products.tags" defaultMessage="TAGS" />,
    ],
  },
];

export const containerColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.container.container" defaultMessage="CONTAINER" />,
    availableColumns: [
      'container.containerNo',
      'container.containerType',
      'container.containerOption',
      'container.warehouseArrivalAgreedDate',
      'container.warehouseArrivalAgreedDateAssignedTo',
      'container.warehouseArrivalActualDate',
      'container.warehouseArrivalActualDateAssignedTo',
      'container.warehouse',
      'container.tags',
      'container.totalPackages',
      'container.totalBatchQuantity',
      'container.totalUniqueItems',
      'container.totalVolume',
      'container.totalWeight',
      'container.totalPrice',
    ],
    columns: [
      <FormattedMessage {...containerMessages.containerNo} />,
      <FormattedMessage {...containerMessages.containerType} />,
      <FormattedMessage {...containerMessages.containerOption} />,
      <FormattedMessage {...containerMessages.warehouseArrivalAgreedDate} />,
      <FormattedMessage {...containerMessages.warehouseArrivalAgreedDateAssignedTo} />,
      <FormattedMessage {...containerMessages.warehouseArrivalActualDate} />,
      <FormattedMessage {...containerMessages.warehouseArrivalActualDateAssignedTo} />,
      <FormattedMessage {...containerMessages.warehouse} />,
      <FormattedMessage {...containerMessages.tags} />,
      <FormattedMessage {...containerMessages.totalPackages} />,
      <FormattedMessage {...containerMessages.totalBatchQuantity} />,
      <FormattedMessage {...containerMessages.totalUniqueItems} />,
      <FormattedMessage {...containerMessages.totalVolume} />,
      <FormattedMessage {...containerMessages.totalWeight} />,
      <FormattedMessage {...containerMessages.totalPrice} />,
    ],
  },
];

export const batchColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />,
    availableColumns: [
      'batch.batchNo',
      'batch.quantity',
      'batch.newQuantity1',
      'batch.newQuantity2',
      'batch.newQuantity3',
      'batch.newQuantity4',
      'batch.newQuantity5',
      'batch.deliveredAt',
      'batch.desiredAt',
      'batch.expiredAt',
      'batch.producedAt',
      'batch.tags',
    ],
    columns: [
      <FormattedMessage {...batchMessages.batchNo} />,
      <FormattedMessage {...batchMessages.initialQuantity} />,
      <FormattedMessage {...batchMessages.newQuantity1} />,
      <FormattedMessage {...batchMessages.newQuantity2} />,
      <FormattedMessage {...batchMessages.newQuantity3} />,
      <FormattedMessage {...batchMessages.newQuantity4} />,
      <FormattedMessage {...batchMessages.newQuantity5} />,
      <FormattedMessage {...batchMessages.deliveredAt} />,
      <FormattedMessage {...batchMessages.desiredAt} />,
      <FormattedMessage {...batchMessages.expiredAt} />,
      <FormattedMessage {...batchMessages.producedAt} />,
      <FormattedMessage {...batchMessages.tags} />,
    ],
  },
  {
    id: 1,
    group: <FormattedMessage id="modules.Batches.packing" defaultMessage="PACKAGING" />,
    availableColumns: [
      'batch.packageName',
      'batch.packageCapacity',
      'batch.packageQuantity',
      'batch.autoCalculatePackageQuantity',
      'batch.packageGrossWeight',
      'batch.packageVolume',
      'batch.packageWidth',
      'batch.packageHeight',
      'batch.packageLength',
    ],
    columns: [
      <FormattedMessage {...batchMessages.packageName} />,
      <FormattedMessage {...batchMessages.packageCapacity} />,
      <FormattedMessage {...batchMessages.packageQuantity} />,
      <FormattedMessage {...batchMessages.autoCalculatePackageQuantity} />,
      <FormattedMessage {...batchMessages.packageGrossWeight} />,
      <FormattedMessage {...batchMessages.packageVolume} />,
      <FormattedMessage id="modules.Batches.packageWidth" defaultMessage="PACKAGE WIDTH" />,
      <FormattedMessage id="modules.Batches.packageHeight" defaultMessage="PACKAGE HEIGHT" />,
      <FormattedMessage id="modules.Batches.packageLength" defaultMessage="PACKAGE LENGTH" />,
    ],
  },
];

export const shipmentColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.Shipments.shipment" defaultMessage="SHIPMENT" />,
    availableColumns: [
      'shipment.shipmentId',
      'shipment.blNo',
      'shipment.blDate',
      'shipment.bookingNo',
      'shipment.bookingDate',
      'shipment.invoiceNo',
      'shipment.transportType',
      'shipment.loadType',
      'shipment.incoterms',
      'shipment.carrier',
      'shipment.forwarderNameA',
      'shipment.forwarderCodeA',
      'shipment.forwarderNameB',
      'shipment.forwarderCodeB',
      'shipment.forwarderNameC',
      'shipment.forwarderCodeC',
      'shipment.forwarderNameD',
      'shipment.forwarderCodeD',
      'shipment.inCharge',
      'shipment.tags',
      'shipment.totalVolume',
      'shipment.totalContainers',
      'shipment.totalBatchQuantity',
      'shipment.totalPrice',
    ],
    columns: [
      <FormattedMessage {...shipmentMessages.shipmentId} />,
      <FormattedMessage {...shipmentMessages.blNo} />,
      <FormattedMessage {...shipmentMessages.blDate} />,
      <FormattedMessage {...shipmentMessages.bookingNo} />,
      <FormattedMessage {...shipmentMessages.bookingDate} />,
      <FormattedMessage {...shipmentMessages.invoiceNo} />,
      <FormattedMessage {...shipmentMessages.transportType} />,
      <FormattedMessage {...shipmentMessages.loadType} />,
      <FormattedMessage {...shipmentMessages.incoterms} />,
      <FormattedMessage {...shipmentMessages.carrier} />,
      <FormattedMessage {...shipmentMessages.forwarderNameA} />,
      <FormattedMessage {...shipmentMessages.forwarderCodeA} />,
      <FormattedMessage {...shipmentMessages.forwarderNameB} />,
      <FormattedMessage {...shipmentMessages.forwarderCodeB} />,
      <FormattedMessage {...shipmentMessages.forwarderNameC} />,
      <FormattedMessage {...shipmentMessages.forwarderCodeC} />,
      <FormattedMessage {...shipmentMessages.forwarderNameD} />,
      <FormattedMessage {...shipmentMessages.forwarderCodeD} />,
      <FormattedMessage id="modules.Shipments.inCharge" defaultMessage="IN CHARGE" />,
      <FormattedMessage {...shipmentMessages.tags} />,
      <FormattedMessage {...shipmentMessages.totalVolume} />,
      <FormattedMessage {...shipmentMessages.totalContainers} />,
      <FormattedMessage {...shipmentMessages.totalBatchQuantity} />,
      <FormattedMessage {...shipmentMessages.totalPrice} />,
    ],
  },
  {
    id: 1,
    group: <FormattedMessage id="modules.Shipments.timeline" defaultMessage="TIMELINE" />,
    availableColumns: [
      'shipment.cargoReady',
      'shipment.loadPort',
      'shipment.loadPortDeparture',
      'shipment.firstTransitPort',
      'shipment.firstTransitPortArrival',
      'shipment.firstTransitPortDeparture',
      'shipment.secondTransitPort',
      'shipment.secondTransitPortArrival',
      'shipment.secondTransitPortDeparture',
      'shipment.dischargePort',
      'shipment.dischargePortArrival',
      'shipment.customsClearance',
      'shipment.warehouse',
      'shipment.warehouseArrival',
      'shipment.deliveryReady',
    ],
    columns: [
      <FormattedMessage {...shipmentMessages.cargoReady} />,
      <FormattedMessage id="modules.Shipments.loadPort" defaultMessage="LOAD PORT" />,
      <FormattedMessage
        id="modules.Shipments.loadPortDeparture"
        defaultMessage="LOAD PORT DEPARTURE"
      />,
      <FormattedMessage
        id="modules.Shipments.firstTransitPort"
        defaultMessage="FIRST TRANSIT PORT"
      />,
      <FormattedMessage
        id="modules.Shipments.firstTransitPortArrival"
        defaultMessage="FIRST TRANSIT PORT ARRIVAL"
      />,
      <FormattedMessage
        id="modules.Shipments.firstTransitPortDeparture"
        defaultMessage="FIRST TRANSIT PORT DEPARTURE"
      />,
      <FormattedMessage
        id="modules.Shipments.secondTransitPort"
        defaultMessage="SECOND TRANSIT PORT"
      />,
      <FormattedMessage
        id="modules.Shipments.secondTransitPortArrival"
        defaultMessage="SECOND TRANSIT PORT ARRIVAL"
      />,
      <FormattedMessage
        id="modules.Shipments.secondTransitPortDeparture"
        defaultMessage="SECOND TRANSIT PORT DEPARTURE"
      />,
      <FormattedMessage id="modules.Shipments.dischargePort" defaultMessage="DISCHARGE PORT" />,
      <FormattedMessage
        id="modules.Shipments.dischargePortArrival"
        defaultMessage="DISCHARGE PORT ARRIVAL"
      />,
      <FormattedMessage
        id="modules.Shipments.customsClearance"
        defaultMessage="CUSTOMS CLEARANCE"
      />,
      <FormattedMessage id="modules.Shipments.warehouse" defaultMessage="WAREHOUSE" />,
      <FormattedMessage
        id="modules.Shipments.warehouseArrival"
        defaultMessage="WAREHOUSE ARRIVAL"
      />,
      <FormattedMessage id="modules.Shipments.deliveryReady" defaultMessage="DELIVERY READY" />,
    ],
  },
];

export const orderColumnFields = [
  {
    messageId: orderMessages.PO.id,
    name: 'poNo',
    columnName: 'order.PO',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: orderMessages.PI.id,
    name: 'piNo',
    columnName: 'order.PI',
    type: 'text',
  },
  {
    messageId: orderMessages.date.id,
    name: 'issuedAt',
    columnName: 'order.date',
    type: 'date',
  },
  {
    messageId: orderMessages.exporterName.id,
    name: 'exporter.name',
    columnName: 'order.exporterName',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: orderMessages.exporterCode.id,
    name: 'exporter.partner.code',
    columnName: 'order.exporterCode',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: orderMessages.currency.id,
    name: 'currency',
    columnName: 'order.currency',
    type: 'enum',
    meta: {
      enumType: 'Currency',
      isRequired: true,
    },
  },
  {
    messageId: orderMessages.incoterm.id,
    name: 'incoterm',
    columnName: 'order.incoterm',
    type: 'enum',
    meta: {
      enumType: 'Incoterm',
    },
  },
  {
    messageId: orderMessages.deliveryPlace.id,
    name: 'deliveryPlace',
    columnName: 'order.deliveryPlace',
    type: 'text',
  },
  {
    messageId: orderMessages.inCharge.id,
    name: 'inCharges',
    columnName: 'order.inCharge',
    type: 'inCharges',
    meta: {
      max: 5,
    },
    getExportValue: ({ inCharges }: { inCharges: Array<Object> } = {}) =>
      (inCharges || []).reduce(
        (field, value) => `${field}${value.firstName} ${value.lastName}, `,
        ''
      ),
  },
  {
    messageId: orderMessages.tags.id,
    name: 'tags',
    columnName: 'order.tags',
    type: 'tags',
    meta: {
      tagType: 'Order',
    },
    getExportValue: ({ tags }: { tags: Array<Object> } = {}) =>
      tags && tags.reduce((field, tag) => `${field}${tag.name}, `, ''),
  },
  {
    messageId: orderMessages.totalItemQuantity.id,
    name: 'totalItemQuantity',
    columnName: 'order.totalItemQuantity',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { orderItems = [] } = values;
      if (orderItems.length === 0) {
        return 0;
      }
      return orderItems.reduce((total, orderItemId) => {
        return total + editData.orderItems[orderItemId].quantity;
      }, 0);
    },
    getExportValue: (values: Object, editData: Object) => {
      const { orderItems = [] } = values;
      if (orderItems.length === 0) {
        return 0;
      }
      return orderItems.reduce((total, orderItemId) => {
        return total + editData.orderItems[orderItemId].quantity;
      }, 0);
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { orderItems = [] } = values;
        if (orderItems.length === 0) {
          return <FormattedNumber value={0} />;
        }

        const totalItemQuantity = orderItems.reduce((total, orderItemId) => {
          return total + editData.orderItems[orderItemId].quantity;
        }, 0);
        return <FormattedNumber value={totalItemQuantity} />;
      },
    },
  },
  {
    messageId: orderMessages.totalPrice.id,
    name: 'orderTotalPrice',
    columnName: 'order.totalPrice',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { orderItems = [], currency } = values;
      if (orderItems.length === 0) {
        return `0${currency}`;
      }
      return `${orderItems.reduce((total, orderItemId) => {
        return total + editData.orderItems[orderItemId].price.amount;
      }, 0)}${currency}`;
    },
    getExportValue: (values: Object, editData: Object) => {
      const { orderItems = [], currency } = values;
      if (orderItems.length === 0) {
        return `0${currency}`;
      }
      return `${orderItems.reduce((total, orderItemId) => {
        return total + editData.orderItems[orderItemId].price.amount;
      }, 0)}${currency}`;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { orderItems = [], currency } = values;
        if (orderItems.length === 0) {
          return (
            <>
              <FormattedNumber value={0} suffix={currency} />
            </>
          );
        }

        const orderTotalPrice = orderItems.reduce((total, orderItemId) => {
          return total + editData.orderItems[orderItemId].price.amount;
        }, 0);
        return (
          <>
            <FormattedNumber value={orderTotalPrice} suffix={currency} />
          </>
        );
      },
    },
  },
  {
    messageId: orderMessages.totalVolume.id,
    name: 'orderTotalVolume',
    columnName: 'order.totalVolume',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { orderItems = [] } = values;
      if (orderItems.length === 0) {
        return '0m³';
      }

      const orderTotalVolume = calculateOrderTotalVolume(orderItems, editData);

      return `${orderTotalVolume}m³`;
    },
    getExportValue: (values: Object, editData: Object) => {
      const { orderItems = [] } = values;
      if (orderItems.length === 0) {
        return '0m³';
      }

      const orderTotalVolume = calculateOrderTotalVolume(orderItems, editData);

      return `${orderTotalVolume}m³`;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { orderItems = [] } = values;
        if (orderItems.length === 0) {
          return <FormattedNumber value={0} suffix="m³" />;
        }

        const orderTotalVolume = calculateOrderTotalVolume(orderItems, editData);

        return <FormattedNumber value={orderTotalVolume} suffix="m³" />;
      },
    },
  },
];

export const orderItemColumnFields = [
  {
    messageId: 'modules.Products.name',
    name: 'productProvider',
    columnName: 'orderItem.name',
    type: 'text',
    meta: {
      disabled: true,
    },
    getFieldValue: (values: Object, editData: Object) => {
      const {
        productProvider: { product: productId },
      } = values;
      const { products } = editData;
      return getByPathWithDefault('', `${productId}.name`, products);
    },
    getExportValue: (values: Object, editData: Object) => {
      const {
        productProvider: { product: productId },
      } = values;
      const { products } = editData;
      return getByPathWithDefault('', `${productId}.name`, products);
    },
  },
  {
    messageId: 'modules.Products.serial',
    name: 'productProvider.product.serial',
    columnName: 'orderItem.serial',
    type: 'text',
    meta: {
      disabled: true,
    },
    getFieldValue: (values: Object, editData: Object) => {
      const {
        productProvider: { product: productId },
      } = values;
      const { products } = editData;
      return getByPathWithDefault('', `${productId}.serial`, products);
    },
    getExportValue: (values: Object, editData: Object) => {
      const {
        productProvider: { product: productId },
      } = values;
      const { products } = editData;
      return getByPathWithDefault('', `${productId}.serial`, products);
    },
  },
  {
    messageId: 'modules.ProductProviders.exporterName',
    name: 'productProvider.exporter.name',
    columnName: 'orderItem.exporterName',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'modules.ProductProviders.exporterCode',
    name: 'productProvider.exporter.partner.code',
    columnName: 'orderItem.exporterCode',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'modules.ProductProviders.supplierName',
    name: 'productProvider.supplier.name',
    columnName: 'orderItem.supplierName',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'modules.ProductProviders.supplierCode',
    name: 'productProvider.supplier.partner.code',
    columnName: 'orderItem.supplierCode',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'modules.ProductProviders.unitPrice',
    name: 'price.amount',
    columnName: 'orderItem.unitPrice',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: 'modules.ProductProviders.unitPriceCurrency',
    name: 'price.currency',
    columnName: 'orderItem.unitPriceCurrency',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'global.quantity',
    name: 'quantity',
    columnName: 'orderItem.quantity',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: orderMessages.totalPrice.id,
    name: 'orderItemTotalPrice',
    columnName: 'orderItem.totalPrice',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: orderItemId } = values;
      const { price, quantity } = editData.orderItems[orderItemId];
      const [, order] =
        (Object.entries(editData.orders || {}): Array<any>).find(
          ([, currentOrder]) =>
            currentOrder.orderItems && currentOrder.orderItems.includes(orderItemId)
        ) || [];
      return `${price.amount * quantity}${order.currency}`;
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: orderItemId } = values;
      const { price, quantity } = editData.orderItems[orderItemId];
      const [, order] =
        (Object.entries(editData.orders || {}): Array<any>).find(
          ([, currentOrder]) =>
            currentOrder.orderItems && currentOrder.orderItems.includes(orderItemId)
        ) || [];
      return `${price.amount * quantity}${order.currency}`;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: orderItemId } = values;
        const { price, quantity } = editData.orderItems[orderItemId];
        const [, order] =
          (Object.entries(editData.orders || {}): Array<any>).find(
            ([, currentOrder]) =>
              currentOrder.orderItems && currentOrder.orderItems.includes(orderItemId)
          ) || [];
        return <FormattedNumber value={price.amount * quantity} suffix={order.currency} />;
      },
    },
  },
];

export const productColumnFields = [
  {
    messageId: 'modules.Products.name',
    name: 'name',
    columnName: 'product.name',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: 'modules.Products.serial',
    columnName: 'product.serial',
    name: 'serial',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: 'modules.Products.janCode',
    columnName: 'product.janCode',
    name: 'janCode',
    type: 'text',
    meta: {
      validator: Yup.string()
        .test(
          'janCode',
          <FormattedMessage
            id="modules.Products.janCodeValidation"
            defaultMessage="JAN Code must be exactly 13 characters"
          />,
          value => {
            if (!value || (value && value.length === 13)) return true;
            return false;
          }
        )
        .nullable(),
    },
  },
  {
    messageId: 'modules.Products.hsCode',
    name: 'hsCode',
    columnName: 'product.hsCode',
    type: 'text',
    meta: {
      validator: Yup.string()
        .test(
          'hsCode',
          <FormattedMessage
            id="modules.Products.hsCodeValidation"
            defaultMessage="HS Code must be exactly 10 characters"
          />,
          value => {
            if (!value || (value && value.length === 10)) return true;
            return false;
          }
        )
        .nullable(),
    },
  },
  {
    messageId: 'modules.Products.material',
    name: 'material',
    columnName: 'product.material',
    type: 'text',
  },
  {
    messageId: productMessages.tags.id,
    name: 'tags',
    columnName: 'product.tags',
    type: 'tags',
    meta: {
      tagType: 'Product',
    },
    getExportValue: ({ tags }: { tags: Array<Object> } = {}) =>
      tags && tags.reduce((field, tag) => `${field}${tag.name}, `, ''),
  },
];

export const batchColumnFields = [
  {
    messageId: batchMessages.batchNo.id,
    name: 'no',
    columnName: 'batch.batchNo',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: batchMessages.initialQuantity.id,
    name: 'quantity',
    columnName: 'batch.quantity',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: batchMessages.newQuantity1.id,
    name: 'batchQuantityRevisions.0',
    columnName: 'batch.newQuantity1',
    type: 'numberAdjustment',
    getExportValue: (values: Object) => {
      const revision = getByPath(`batchQuantityRevisions.0`, values);
      if (!revision) return '';

      const { type, quantity } = revision;
      return `${type}-${quantity}`;
    },
  },
  {
    messageId: batchMessages.newQuantity2.id,
    name: 'batchQuantityRevisions.1',
    columnName: 'batch.newQuantity2',
    type: 'numberAdjustment',
    getExportValue: (values: Object) => {
      const revision = getByPath(`batchQuantityRevisions.1`, values);
      if (!revision) return '';

      const { type, quantity } = revision;
      return `${type}-${quantity}`;
    },
  },
  {
    messageId: batchMessages.newQuantity3.id,
    name: 'batchQuantityRevisions.2',
    columnName: 'batch.newQuantity3',
    type: 'numberAdjustment',
    getExportValue: (values: Object) => {
      const revision = getByPath(`batchQuantityRevisions.2`, values);
      if (!revision) return '';

      const { type, quantity } = revision;
      return `${type}-${quantity}`;
    },
  },
  {
    messageId: batchMessages.newQuantity4.id,
    name: 'batchQuantityRevisions.3',
    columnName: 'batch.newQuantity4',
    type: 'numberAdjustment',
    getExportValue: (values: Object) => {
      const revision = getByPath(`batchQuantityRevisions.3`, values);
      if (!revision) return '';

      const { type, quantity } = revision;
      return `${type}-${quantity}`;
    },
  },
  {
    messageId: batchMessages.newQuantity5.id,
    name: 'batchQuantityRevisions.4',
    columnName: 'batch.newQuantity5',
    type: 'numberAdjustment',
    getExportValue: (values: Object) => {
      const revision = getByPath(`batchQuantityRevisions.4`, values);
      if (!revision) return '';

      const { type, quantity } = revision;
      return `${type}-${quantity}`;
    },
  },
  {
    messageId: batchMessages.deliveredAt.id,
    columnName: 'batch.deliveredAt',
    name: 'deliveredAt',
    type: 'date',
  },
  {
    messageId: batchMessages.desiredAt.id,
    name: 'desiredAt',
    columnName: 'batch.desiredAt',
    type: 'date',
  },
  {
    messageId: batchMessages.expiredAt.id,
    name: 'expiredAt',
    columnName: 'batch.expiredAt',
    type: 'date',
  },
  {
    messageId: batchMessages.producedAt.id,
    name: 'producedAt',
    columnName: 'batch.producedAt',
    type: 'date',
  },
  {
    messageId: batchMessages.tags.id,
    columnName: 'batch.tags',
    name: 'tags',
    type: 'tags',
    meta: {
      tagType: 'Batch',
    },
    getExportValue: ({ tags }: { tags: Array<Object> } = {}) =>
      tags.reduce((field, tag) => `${field}${tag.name}, `, ''),
  },
  {
    messageId: batchMessages.packageName.id,
    name: 'packageName',
    columnName: 'batch.packageName',
    type: 'text',
  },
  {
    messageId: batchMessages.packageCapacity.id,
    name: 'packageCapacity',
    columnName: 'batch.packageCapacity',
    type: 'number',
  },
  {
    messageId: batchMessages.packageQuantity.id,
    name: 'packageQuantity',
    columnName: 'batch.packageQuantity',
    type: 'number',
  },
  {
    messageId: batchMessages.autoCalculatePackageQuantity.id,
    name: 'autoCalculatePackageQuantity',
    columnName: 'batch.autoCalculatePackageQuantity',
    type: 'toggle',
  },
  {
    messageId: batchMessages.packageGrossWeight.id,
    name: 'packageGrossWeight',
    columnName: 'batch.packageGrossWeight',
    type: 'metric',
    meta: {
      metrics: weightMetrics,
      convert: convertWeight,
    },
    getExportValue: ({ packageGrossWeight }: { packageGrossWeight: Object } = {}) =>
      packageGrossWeight && `${packageGrossWeight.value} ${packageGrossWeight.metric}`,
  },
  {
    messageId: batchMessages.packageVolume.id,
    columnName: 'batch.packageVolume',
    name: 'packageVolume',
    type: 'metric',
    meta: {
      metrics: volumeMetrics,
      convert: convertVolume,
    },
    getExportValue: ({ packageVolume }: { packageVolume: Object } = {}) =>
      packageVolume && `${packageVolume.value} ${packageVolume.metric}`,
  },
  {
    messageId: 'modules.Batches.pkgWidth',
    columnName: 'batch.packageWidth',
    name: 'packageSize.width',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: convertDistance,
      sourcePath: 'packageSize',
      destPath: 'width',
    },
    getExportValue: ({ packageSize }: { packageSize: Object } = {}) =>
      packageSize && packageSize.width && `${packageSize.width.value} ${packageSize.width.metric}`,
  },
  {
    messageId: 'modules.Batches.pkgHeight',
    name: 'packageSize.height',
    columnName: 'batch.packageHeight',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: convertDistance,
      sourcePath: 'packageSize',
      destPath: 'height',
    },
    getExportValue: ({ packageSize }: { packageSize: Object } = {}) =>
      packageSize &&
      packageSize.height &&
      `${packageSize.height.value} ${packageSize.height.metric}`,
  },
  {
    messageId: 'modules.Batches.pkgLength',
    name: 'packageSize.length',
    columnName: 'batch.packageLength',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: convertDistance,
      sourcePath: 'packageSize',
      destPath: 'length',
    },
    getExportValue: ({ packageSize }: { packageSize: Object } = {}) =>
      packageSize &&
      packageSize.length &&
      `${packageSize.length.value} ${packageSize.length.metric}`,
  },
];

export const containerColumnFields = [
  {
    messageId: containerMessages.containerNo.id,
    name: 'no',
    columnName: 'container.containerNo',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: containerMessages.containerType.id,
    name: 'containerType',
    columnName: 'container.containerType',
    type: 'select',
    meta: {
      items: CONTAINER_TYPE_ITEMS,
    },
  },
  {
    messageId: containerMessages.containerOption.id,
    name: 'containerOption',
    columnName: 'container.containerOption',
    type: 'enumSelect',
    meta: {
      enumType: 'ContainerOption',
    },
  },
  {
    messageId: containerMessages.warehouseArrivalAgreedDate.id,
    name: 'warehouseArrivalAgreedDate',
    columnName: 'container.warehouseArrivalAgreedDate',
    type: 'datetimeWithApproval',
    getFieldValue: (values: Object) => {
      return {
        approvedBy: getByPath(`warehouseArrivalAgreedDateApprovedBy`, values),
        approvedAt: getByPath(`warehouseArrivalAgreedDateApprovedAt`, values),
        date: getByPath(`warehouseArrivalAgreedDate`, values),
      };
    },
  },
  {
    messageId: containerMessages.warehouseArrivalAgreedDateAssignedTo.id,
    name: 'warehouseArrivalAgreedDateAssignedTo',
    columnName: 'container.warehouseArrivalAgreedDateAssignedTo',
    type: 'inCharges',
    meta: {
      max: 5,
    },
    getExportValue: ({
      warehouseArrivalAgreedDateAssignedTo: inCharges,
    }: { warehouseArrivalAgreedDateAssignedTo: Array<Object> } = {}) =>
      (inCharges || []).reduce(
        (field, value) => `${field}${value.firstName} ${value.lastName}, `,
        ''
      ),
  },
  {
    messageId: containerMessages.warehouseArrivalActualDate.id,
    name: 'warehouseArrivalActualDate',
    columnName: 'container.warehouseArrivalActualDate',
    type: 'datetimeWithApproval',
    getFieldValue: (values: Object) => {
      return {
        approvedBy: getByPath(`warehouseArrivalActualDateApprovedBy`, values),
        approvedAt: getByPath(`warehouseArrivalActualDateApprovedAt`, values),
        date: getByPath(`warehouseArrivalActualDate`, values),
      };
    },
  },
  {
    messageId: containerMessages.warehouseArrivalActualDateAssignedTo.id,
    name: 'warehouseArrivalActualDateAssignedTo',
    columnName: 'container.warehouseArrivalActualDateAssignedTo',
    type: 'inCharges',
    meta: {
      max: 5,
    },
    getExportValue: ({
      warehouseArrivalActualDateAssignedTo: inCharges,
    }: { warehouseArrivalActualDateAssignedTo: Array<Object> } = {}) =>
      (inCharges || []).reduce(
        (field, value) => `${field}${value.firstName} ${value.lastName}, `,
        ''
      ),
  },
  {
    messageId: containerMessages.warehouse.id,
    name: 'warehouse',
    columnName: 'container.warehouse',
    type: 'warehouse',
    getExportValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      return getByPathWithDefault('', `containers.${containerId}.warehouse.name`, editData);
    },
  },
  {
    messageId: containerMessages.tags.id,
    name: 'tags',
    columnName: 'container.tags',
    type: 'tags',
    meta: {
      tagType: 'Container',
    },
    getExportValue: ({ tags }: { tags: Array<Object> } = {}) =>
      tags.reduce((field, tag) => `${field}${tag.name}, `, ''),
  },
  {
    messageId: containerMessages.totalPackages.id,
    name: 'containerTotalPackages',
    columnName: 'container.totalPackages',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return container.batches.reduce((total, batch) => {
        return total + getByPathWithDefault(0, `batches.${batch.id}.packageQuantity`, editData);
      }, 0);
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return container.batches.reduce((total, batch) => {
        return total + getByPathWithDefault(0, `batches.${batch.id}.packageQuantity`, editData);
      }, 0);
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: containerId } = values;
        const container = editData.containers[containerId];

        const totalPackages = (container.batches || []).reduce((total, batch) => {
          return total + getByPathWithDefault(0, `batches.${batch.id}.packageQuantity`, editData);
        }, 0);
        return <FormattedNumber value={totalPackages} />;
      },
    },
  },
  {
    messageId: containerMessages.totalBatchQuantity.id,
    name: 'containerTotalBatchQuantity',
    columnName: 'container.totalBatchQuantity',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return container.batches.reduce((total, batch) => {
        return total + getBatchLatestQuantity(getByPath(`batches.${batch.id}`, editData));
      }, 0);
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return container.batches.reduce((total, batch) => {
        return total + getBatchLatestQuantity(getByPath(`batches.${batch.id}`, editData));
      }, 0);
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: containerId } = values;
        const container = editData.containers[containerId];

        const totalBatchQuantity = (container.batches || []).reduce((total, batch) => {
          return total + getBatchLatestQuantity(getByPath(`batches.${batch.id}`, editData));
        }, 0);
        return <FormattedNumber value={totalBatchQuantity} />;
      },
    },
  },
  {
    messageId: containerMessages.totalUniqueItems.id,
    name: 'containerTotalUniqueItems',
    columnName: 'container.totalUniqueItems',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return container.batches.reduce((orderItems, batch) => {
        const currentBatch = getByPath(`batches.${batch.id}`, editData);
        if (
          currentBatch &&
          currentBatch.orderItem &&
          !orderItems.includes(currentBatch.orderItem)
        ) {
          orderItems.push(currentBatch.orderItem);
        }

        return orderItems;
      }, []).length;
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return container.batches.reduce((orderItems, batch) => {
        const currentBatch = getByPath(`batches.${batch.id}`, editData);
        if (
          currentBatch &&
          currentBatch.orderItem &&
          !orderItems.includes(currentBatch.orderItem)
        ) {
          orderItems.push(currentBatch.orderItem);
        }

        return orderItems;
      }, []).length;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: containerId } = values;
        const container = editData.containers[containerId];

        const totalUniqueItems = (container.batches || []).reduce((orderItems, batch) => {
          const currentBatch = getByPath(`batches.${batch.id}`, editData);
          if (
            currentBatch &&
            currentBatch.orderItem &&
            !orderItems.includes(currentBatch.orderItem)
          ) {
            orderItems.push(currentBatch.orderItem);
          }

          return orderItems;
        }, []).length;
        return <FormattedNumber value={totalUniqueItems} />;
      },
    },
  },
  {
    messageId: containerMessages.totalVolume.id,
    name: 'containerTotalVolume',
    columnName: 'container.totalVolume',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return container.batches.reduce((total, batch) => {
        return total + findVolume(getByPath(`batches.${batch.id}`, editData));
      }, 0);
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return `${container.batches.reduce((total, batch) => {
        return total + findVolume(getByPath(`batches.${batch.id}`, editData));
      }, 0)}m³`;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: containerId } = values;
        const container = editData.containers[containerId];

        const totalVolume = (container.batches || []).reduce((total, batch) => {
          return total + findVolume(getByPath(`batches.${batch.id}`, editData));
        }, 0);

        return <FormattedNumber value={totalVolume} suffix="m³" />;
      },
    },
  },
  {
    messageId: containerMessages.totalWeight.id,
    name: 'containerTotalWeight',
    columnName: 'container.totalWeight',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return container.batches.reduce((total, batch) => {
        return total + findWeight(getByPath(`batches.${batch.id}`, editData));
      }, 0);
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const container = editData.containers[containerId];
      return `${container.batches.reduce((total, batch) => {
        return total + findWeight(getByPath(`batches.${batch.id}`, editData));
      }, 0)}kg`;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: containerId } = values;
        const container = editData.containers[containerId];

        const totalWeight = (container.batches || []).reduce((total, batch) => {
          return total + findWeight(getByPath(`batches.${batch.id}`, editData));
        }, 0);

        return <FormattedNumber value={totalWeight} suffix="kg" />;
      },
    },
  },
  {
    messageId: containerMessages.totalPrice.id,
    name: 'containerTotalPrice',
    columnName: 'container.totalPrice',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const { total } = calculateContainerTotalPrice(containerId, editData);
      if (total < 0) return 'Invalid';
      return total;
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: containerId } = values;
      const { total, allCurrencies } = calculateContainerTotalPrice(containerId, editData);
      if (total < 0) return 'Invalid';
      return `${total}${allCurrencies[0] || 'USD'}`;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: containerId } = values;
        const { total, allCurrencies } = calculateContainerTotalPrice(containerId, editData);
        if (total < 0) {
          return (
            <Tooltip
              message={
                <FormattedMessage
                  id="modules.Containers.invalidCurrency"
                  defaultMessage="Cannot compute this field because this Container contains Batches with different Currencies"
                />
              }
            >
              <div>
                <FormattedMessage id="global.invalid" defaultMessage="Invalid" />
              </div>
            </Tooltip>
          );
        }
        return <FormattedNumber value={total} suffix={allCurrencies[0]} />;
      },
    },
  },
];

export const shipmentColumnFields = [
  {
    messageId: shipmentMessages.shipmentId.id,
    name: 'no',
    columnName: 'shipment.shipmentId',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: shipmentMessages.blNo.id,
    name: 'blNo',
    columnName: 'shipment.blNo',
    type: 'text',
  },
  {
    messageId: shipmentMessages.blDate.id,
    name: 'blDate',
    columnName: 'shipment.blDate',
    type: 'date',
  },
  {
    messageId: shipmentMessages.bookingNo.id,
    name: 'bookingNo',
    columnName: 'shipment.bookingNo',
    type: 'text',
  },
  {
    messageId: shipmentMessages.bookingDate.id,
    name: 'bookingDate',
    columnName: 'shipment.bookingDate',
    type: 'date',
  },
  {
    messageId: shipmentMessages.invoiceNo.id,
    name: 'invoiceNo',
    columnName: 'shipment.invoiceNo',
    type: 'text',
  },
  {
    messageId: shipmentMessages.transportType.id,
    name: 'transportType',
    columnName: 'shipment.transportType',
    type: 'enumSelect',
    meta: {
      enumType: 'TransportType',
    },
  },
  {
    messageId: shipmentMessages.loadType.id,
    name: 'loadType',
    columnName: 'shipment.loadType',
    type: 'enumSelect',
    meta: {
      enumType: 'LoadType',
    },
  },
  {
    messageId: shipmentMessages.incoterms.id,
    name: 'incoterm',
    columnName: 'shipment.incoterms',
    type: 'enum',
    meta: {
      enumType: 'Incoterm',
    },
  },
  {
    messageId: shipmentMessages.carrier.id,
    name: 'carrier',
    columnName: 'shipment.carrier',
    type: 'text',
  },
  {
    messageId: shipmentMessages.forwarderNameA.id,
    name: 'forwarders.0.name',
    columnName: 'shipment.forwarderNameA',
    type: 'forwarders',
    getExportValue: (value: Object) => getByPathWithDefault('', `forwarders.0.name`, value),
  },
  {
    messageId: shipmentMessages.forwarderCodeA.id,
    name: 'forwarders.0.partner.code',
    columnName: 'shipment.forwarderCodeA',
    type: 'forwarders',
    getExportValue: (value: Object) => getByPathWithDefault('', `forwarders.0.partner.code`, value),
    meta: {
      disabled: true,
    },
  },
  {
    messageId: shipmentMessages.forwarderNameB.id,
    name: 'forwarders.1.name',
    columnName: 'shipment.forwarderNameB',
    type: 'forwarders',
    getExportValue: (value: Object) => getByPathWithDefault('', `forwarders.1.name`, value),
  },
  {
    messageId: shipmentMessages.forwarderCodeB.id,
    name: 'forwarders.1.partner.code',
    columnName: 'shipment.forwarderCodeB',
    type: 'forwarders',
    getExportValue: (value: Object) => getByPathWithDefault('', `forwarders.1.partner.code`, value),
    meta: {
      disabled: true,
    },
  },
  {
    messageId: shipmentMessages.forwarderNameC.id,
    name: 'forwarders.2.name',
    columnName: 'shipment.forwarderNameC',
    type: 'forwarders',
    getExportValue: (value: Object) => getByPathWithDefault('', `forwarders.2.name`, value),
  },
  {
    messageId: shipmentMessages.forwarderCodeC.id,
    name: 'forwarders.2.partner.code',
    columnName: 'shipment.forwarderCodeC',
    type: 'forwarders',
    getExportValue: (value: Object) => getByPathWithDefault('', `forwarders.2.partner.code`, value),
    meta: {
      disabled: true,
    },
  },
  {
    messageId: shipmentMessages.forwarderNameD.id,
    name: 'forwarders.3.name',
    columnName: 'shipment.forwarderNameD',
    type: 'forwarders',
    getExportValue: (value: Object) => getByPathWithDefault('', `forwarders.3.name`, value),
  },
  {
    messageId: shipmentMessages.forwarderCodeD.id,
    name: 'forwarders.3.partner.code',
    columnName: 'shipment.forwarderCodeD',
    type: 'forwarders',
    getExportValue: (value: Object) => getByPathWithDefault('', `forwarders.3.partner.code`, value),
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'modules.Shipments.inCharge',
    name: 'inCharges',
    columnName: 'shipment.inCharge',
    type: 'inCharges',
    meta: {
      max: 5,
    },
    getExportValue: ({ inCharges }: { inCharges: Array<Object> } = {}) =>
      (inCharges || []).reduce(
        (field, value) => `${field}${value.firstName} ${value.lastName}, `,
        ''
      ),
  },
  {
    messageId: shipmentMessages.tags.id,
    name: 'tags',
    columnName: 'shipment.tags',
    type: 'tags',
    meta: {
      tagType: 'Shipment',
    },
    getExportValue: ({ tags }: { tags: Array<Object> } = {}) =>
      tags.reduce((field, tag) => `${field}${tag.name}, `, ''),
  },
  {
    messageId: shipmentMessages.totalVolume.id,
    name: 'shipmentTotalVolume',
    columnName: 'shipment.totalVolume',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: shipmentId } = values;
      const shipmentTotalVolume = calculateShipmentTotalVolume(shipmentId, editData);
      return `${shipmentTotalVolume}m³`;
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: shipmentId } = values;
      const shipmentTotalVolume = calculateShipmentTotalVolume(shipmentId, editData);
      return `${shipmentTotalVolume}m³`;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: shipmentId } = values;
        const shipmentTotalVolume = calculateShipmentTotalVolume(shipmentId, editData);
        return <FormattedNumber value={shipmentTotalVolume} suffix="m³" />;
      },
    },
  },
  {
    messageId: shipmentMessages.totalContainers.id,
    name: 'shipmentTotalContainers',
    columnName: 'shipment.totalContainers',
    type: 'calculate',
    getFieldValue: (values: Object) => {
      const { containerGroups = [] } = values;
      return containerGroups.length;
    },
    getExportValue: (values: Object) => {
      const { containerGroups = [] } = values;
      return containerGroups.length;
    },
    meta: {
      renderValue: (values: Object) => {
        const { containerGroups = [] } = values;
        return <FormattedNumber value={containerGroups.length} />;
      },
    },
  },
  {
    messageId: shipmentMessages.totalBatchQuantity.id,
    name: 'shipmentTotalBatchQuantity',
    columnName: 'shipment.totalBatchQuantity',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: shipmentId } = values;
      return calculateShipmentTotalBatchQuantity(shipmentId, editData);
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: shipmentId } = values;
      return calculateShipmentTotalBatchQuantity(shipmentId, editData);
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: shipmentId } = values;
        return (
          <FormattedNumber value={calculateShipmentTotalBatchQuantity(shipmentId, editData)} />
        );
      },
    },
  },
  {
    messageId: shipmentMessages.totalPrice.id,
    name: 'shipmentTotalPrice',
    columnName: 'shipment.totalPrice',
    type: 'calculate',
    getFieldValue: (values: Object, editData: Object) => {
      const { id: shipmentId } = values;
      const { total } = calculateShipmentTotalPrice(shipmentId, editData);
      if (total < 0) return 'Invalid';
      return total;
    },
    getExportValue: (values: Object, editData: Object) => {
      const { id: shipmentId } = values;
      const { total, allCurrencies } = calculateShipmentTotalPrice(shipmentId, editData);
      if (total < 0) return 'Invalid';
      return `${total}${allCurrencies[0] || 'USD'}`;
    },
    meta: {
      renderValue: (values: Object, editData: Object) => {
        const { id: shipmentId } = values;
        const { total, allCurrencies } = calculateShipmentTotalPrice(shipmentId, editData);
        if (total < 0) {
          return (
            <Tooltip
              message={
                <FormattedMessage
                  id="modules.Shipments.invalidCurrency"
                  defaultMessage="Cannot compute this field because this Shipment contains Cargo with different Currencies"
                />
              }
            >
              <div>
                <FormattedMessage id="global.invalid" defaultMessage="Invalid" />
              </div>
            </Tooltip>
          );
        }
        return <FormattedNumber value={total} suffix={allCurrencies[0]} />;
      },
    },
  },
  {
    messageId: shipmentMessages.cargoReady.id,
    name: 'cargoReady',
    columnName: 'shipment.cargoReady',
    type: 'timeline',
    getExportValue: (values: Object) => getLatestDate(getByPath(`cargoReady`, values)) || '',
  },
  {
    messageId: 'modules.Shipments.loadPort',
    name: 'voyages.0.departurePort',
    columnName: 'shipment.loadPort',
    type: 'port',
    getFieldValue: (values: Object) => {
      const { transportType } = values;
      return getByPath(
        `voyages.0.departurePort.${transportType === 'Air' ? 'airport' : 'seaport'}`,
        values
      );
    },
    getFieldName: ({ transportType }: { transportType: ?string }) => {
      return `voyages.0.departurePort.${transportType === 'Air' ? 'airport' : 'seaport'}`;
    },
    getExportValue: (values: Object) => {
      const { transportType } = values;
      return getByPathWithDefault(
        '',
        `voyages.0.departurePort.${transportType === 'Air' ? 'airport' : 'seaport'}`,
        values
      );
    },
  },
  {
    messageId: 'modules.Shipments.loadPortDeparture',
    name: 'voyages.0.departure',
    columnName: 'shipment.loadPortDeparture',
    type: 'timeline',
    getExportValue: (values: Object) =>
      getLatestDate(getByPath(`voyages.0.departure`, values)) || '',
  },
  {
    messageId: 'modules.Shipments.firstTransitPort',
    name: 'voyages.0.arrivalPort',
    columnName: 'shipment.firstTransitPort',
    type: 'port',
    getFieldValue: (values: Object) => {
      const { transportType, voyages } = values;
      return voyages.length > 1
        ? getByPath(
            `voyages.0.arrivalPort.${transportType === 'Air' ? 'airport' : 'seaport'}`,
            values
          )
        : null;
    },
    getFieldName: (values: Object) => {
      const { transportType } = values;
      return `voyages.0.arrivalPort.${transportType === 'Air' ? 'airport' : 'seaport'}`;
    },
    getExportValue: (values: Object) => {
      const { transportType, voyages } = values;
      return voyages.length > 1
        ? getByPathWithDefault(
            '',
            `voyages.0.arrivalPort.${transportType === 'Air' ? 'airport' : 'seaport'}`,
            values
          )
        : null;
    },
    meta: {
      isFirstTransitPort: true,
    },
  },
  {
    messageId: 'modules.Shipments.firstTransitPortArrival',
    name: 'voyages.0.arrival',
    columnName: 'shipment.firstTransitPortArrival',
    type: 'timeline',
    getFieldValue: (values: Object) => {
      const { voyages } = values;
      return voyages.length > 1 ? getByPath('voyages.0.arrival', values) : null;
    },
    getExportValue: (values: Object) => {
      const { voyages } = values;
      return voyages.length > 1 ? getLatestDate(getByPath(`voyages.0.arrival`, values)) || '' : '';
    },
  },
  {
    messageId: 'modules.Shipments.firstTransitPortDeparture',
    name: 'voyages.1.departure',
    columnName: 'shipment.firstTransitPortDeparture',
    type: 'timeline',
    getFieldValue: (values: Object) => {
      const { voyages } = values;
      return voyages.length > 1 ? getByPath('voyages.1.departure', values) : null;
    },
    getExportValue: (values: Object) => {
      const { voyages } = values;
      return voyages.length > 1
        ? getLatestDate(getByPath(`voyages.1.departure`, values)) || ''
        : '';
    },
  },
  {
    messageId: 'modules.Shipments.secondTransitPort',
    name: 'voyages.1.arrivalPort',
    columnName: 'shipment.secondTransitPort',
    type: 'port',
    getFieldValue: (values: Object) => {
      const { transportType, voyages } = values;
      return voyages.length > 2
        ? getByPath(
            `voyages.1.arrivalPort.${transportType === 'Air' ? 'airport' : 'seaport'}`,
            values
          )
        : null;
    },
    getFieldName: (values: Object) => {
      const { transportType } = values;
      return `voyages.1.arrivalPort.${transportType === 'Air' ? 'airport' : 'seaport'}`;
    },
    getExportValue: (values: Object) => {
      const { transportType, voyages } = values;
      return voyages.length > 2
        ? getByPath(
            `voyages.1.arrivalPort.${transportType === 'Air' ? 'airport' : 'seaport'}`,
            values
          ) || ''
        : '';
    },
    meta: {
      isSecondTransitPort: true,
    },
  },
  {
    messageId: 'modules.Shipments.secondTransitPortArrival',
    name: 'voyages.1.arrival',
    columnName: 'shipment.secondTransitPortArrival',
    type: 'timeline',
    getFieldValue: (values: Object) => {
      const { voyages } = values;
      return voyages.length > 2 ? getByPath('voyages.1.arrival', values) : null;
    },
    getExportValue: (values: Object) => {
      const { voyages } = values;
      return voyages.length > 2 ? getLatestDate(getByPath(`voyages.1.arrival`, values)) || '' : '';
    },
  },
  {
    messageId: 'modules.Shipments.secondTransitPortDeparture',
    name: 'voyages.2.departure',
    columnName: 'shipment.secondTransitPortDeparture',
    type: 'timeline',
    getFieldValue: (values: Object) => {
      const { voyages } = values;
      return voyages.length > 1 ? getByPath('voyages.2.departure', values) : null;
    },
    getExportValue: (values: Object) => {
      const { voyages } = values;
      return voyages.length > 1
        ? getLatestDate(getByPath(`voyages.2.departure`, values)) || ''
        : '';
    },
  },
  {
    messageId: 'modules.Shipments.dischargePort',
    name: 'voyages.2.arrivalPort',
    columnName: 'shipment.dischargePort',
    type: 'port',
    getFieldValue: (values: Object) => {
      const { transportType, voyages } = values;
      return getByPath(
        `voyages.${voyages.length - 1}.arrivalPort.${
          transportType === 'Air' ? 'airport' : 'seaport'
        }`,
        values
      );
    },
    getFieldName: (values: Object) => {
      const { transportType, voyages } = values;
      return `voyages.${voyages.length - 1}.arrivalPort.${
        transportType === 'Air' ? 'airport' : 'seaport'
      }`;
    },
    getExportValue: (values: Object) => {
      const { transportType, voyages } = values;
      return getByPathWithDefault(
        '',
        `voyages.${voyages.length - 1}.arrivalPort.${
          transportType === 'Air' ? 'airport' : 'seaport'
        }`,
        values
      );
    },
  },
  {
    messageId: 'modules.Shipments.dischargePortArrival',
    name: 'voyages.2.arrival',
    columnName: 'shipment.dischargePortArrival',
    type: 'timeline',
    getFieldValue: ({ voyages }: { voyages: Array<Object> }) =>
      getByPath(`${voyages.length - 1}.arrival`, voyages),
    getFieldName: ({ voyages }: { voyages: Array<Object> }) =>
      `voyages.${voyages.length - 1}.arrival`,
    getExportValue: (values: Object) =>
      getLatestDate(getByPath(`voyages.${values.voyages.length - 1}.arrival`, values)) || '',
  },
  {
    messageId: 'modules.Shipments.customsClearance',
    name: 'containerGroups.0.customClearance',
    columnName: 'shipment.customsClearance',
    type: 'timeline',
    getExportValue: (values: Object) =>
      getLatestDate(getByPath('containerGroups.0.customClearance', values)) || '',
  },
  {
    messageId: 'modules.Shipments.warehouse',
    name: 'containerGroups.0.warehouse',
    columnName: 'shipment.warehouse',
    type: 'warehouse',
    getExportValue: (values: Object) => {
      return getByPath(`containerGroups.0.warehouse.name`, values) || '';
    },
    meta: {
      disableIfContainersExist: true,
    },
  },
  {
    messageId: 'modules.Shipments.warehouseArrival',
    name: 'containerGroups.0.warehouseArrival',
    columnName: 'shipment.warehouseArrival',
    type: 'timeline',
    getExportValue: (values: Object) =>
      getLatestDate(getByPath('containerGroups.0.warehouseArrival', values)) || '',
  },
  {
    messageId: 'modules.Shipments.deliveryReady',
    name: 'containerGroups.0.deliveryReady',
    columnName: 'shipment.deliveryReady',
    type: 'timeline',
    getExportValue: (values: Object) =>
      getLatestDate(getByPath('containerGroups.0.deliveryReady', values)) || '',
  },
];

export const orderColumnIds: Array<string> = orderColumnFields.map(item => item.columnName);

export const orderItemColumnIds: Array<string> = orderItemColumnFields.map(item => item.columnName);

export const batchColumnIds: Array<string> = batchColumnFields.map(item => item.columnName);

export const containerColumnIds: Array<string> = containerColumnFields.map(item => item.columnName);

export const shipmentColumnIds: Array<string> = shipmentColumnFields.map(item => item.columnName);

export const productColumnIds: Array<string> = productColumnFields.map(item => item.columnName);

export const allColumnIds = [
  ...orderColumnIds,
  ...orderItemColumnIds,
  ...batchColumnIds,
  ...containerColumnIds,
  ...shipmentColumnIds,
  ...productColumnIds,
];
