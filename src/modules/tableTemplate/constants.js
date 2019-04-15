// @flow
import * as React from 'react';
import * as Yup from 'yup';
import { FormattedMessage } from 'react-intl';
import { ORDER, ORDER_ITEM, BATCH, SHIPMENT, PRODUCT } from 'constants/keywords';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
import shipmentMessages from 'modules/shipment/messages';
import productMessages from 'modules/product/messages';
import FormattedNumber from 'components/FormattedNumber';
import {
  metrics as weightMetrics,
  convert as weightConvert,
} from 'modules/form/helpers/metricInput/weightInput';
import Tooltip from 'components/Tooltip';
import {
  metrics as volumeMetrics,
  convert as volumeConvert,
} from 'modules/form/helpers/metricInput/volumeInput';
import {
  metrics as distanceMetrics,
  convert as distanceConvert,
} from 'modules/form/helpers/metricInput/distanceInput';
import {
  mapColumnId,
  calculateOrderTotalVolume,
  calculateShipmentTotalVolume,
  calculateShipmentTotalBatchQuantity,
  calculateShipmentTotalPrice,
} from './helpers';

export const orderColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.Orders.order" defaultMessage="ORDER" />,
    columns: [
      <FormattedMessage {...orderMessages.PO} />,
      <FormattedMessage {...orderMessages.PI} />,
      <FormattedMessage {...orderMessages.date} />,
      <FormattedMessage {...orderMessages.exporter} />,
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
    columns: [
      <FormattedMessage id="modules.Products.name" defaultMessage="NAME" />,
      <FormattedMessage id="modules.Products.serial" defaultMessage="SERIAL" />,
      <FormattedMessage id="modules.ProductProviders.exporter" defaultMessage="EXPORTER" />,
      <FormattedMessage id="modules.ProductProviders.supplier" defaultMessage="SUPPLIER" />,
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
    columns: [
      <FormattedMessage id="modules.container.containerNo" defaultMessage="CONTAINER NO" />,
      <FormattedMessage id="module.container.agreedArrival" defaultMessage="AGREED ARRIVAL" />,
      <FormattedMessage
        id="modules.container.agreedArrivalAssignedTo"
        defaultMessage="AGREED ARRIVAL ASSIGNED TO"
      />,
      <FormattedMessage id="module.container.actualArrival" defaultMessage="ACTUAL ARRIVAL" />,
      <FormattedMessage
        id="modules.container.actualArrivalAssignedTo"
        defaultMessage="ACTUAL ARRIVAL ASSIGNED TO"
      />,
      <FormattedMessage id="modules.container.warehouse" defaultMessage="WAREHOUSE" />,
      <FormattedMessage id="modules.container.tags" defaultMessage="TAGS" />,
      <FormattedMessage id="modules.container.totalPackages" defaultMessage="TOTAL PACKAGES" />,
      <FormattedMessage id="modules.container.totalBatchQuantity" defaultMessage="BATCHED QTY" />,
      <FormattedMessage id="modules.container.totalUniqueItems" defaultMessage="UNIQUE ITEMS" />,
      <FormattedMessage id="modules.container.totalVolume" defaultMessage="TOTAL VOLUME" />,
      <FormattedMessage id="modules.container.totalWeight" defaultMessage="TOTAL WEIGHT" />,
      <FormattedMessage id="modules.container.totalPrice" defaultMessage="TOTAL PRICE" />,
    ],
  },
];

export const batchColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.Batches.batch" defaultMessage="BATCH" />,
    columns: [
      <FormattedMessage {...batchMessages.batchNo} />,
      <FormattedMessage {...batchMessages.quantity} />,
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
    columns: [
      <FormattedMessage {...batchMessages.packageName} />,
      <FormattedMessage {...batchMessages.packageQuantity} />,
      <FormattedMessage {...batchMessages.packageGrossWeight} />,
      <FormattedMessage {...batchMessages.packageVolume} />,
      <FormattedMessage id="modules.Batches.pkgWidth" defaultMessage="PKG WIDTH" />,
      <FormattedMessage id="modules.Batches.pkgHeight" defaultMessage="PKG HEIGHT" />,
      <FormattedMessage id="modules.Batches.pkgLength" defaultMessage="PKG LENGTH" />,
    ],
  },
];

export const shipmentColumns = [
  {
    id: 0,
    group: <FormattedMessage id="modules.Shipments.shipment" defaultMessage="SHIPMENT" />,
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
      <FormattedMessage {...shipmentMessages.forwarder} />,
      <FormattedMessage id="modules.Shipments.inCharge" defaultMessage="IN CHARGE " />,
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
    columns: [
      <FormattedMessage {...shipmentMessages.cargoReady} />,
      <FormattedMessage
        id="modules.Shipments.loadPortDeparture"
        defaultMessage="LOAD PORT DEPARTURE"
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
        id="modules.Shipments.secondTransitPortArrival"
        defaultMessage="SECOND TRANSIT PORT ARRIVAL"
      />,
      <FormattedMessage
        id="modules.Shipments.secondTransitPortDeparture"
        defaultMessage="SECOND TRANSIT PORT DEPARTURE"
      />,
      <FormattedMessage
        id="modules.Shipments.dischargePortArrival"
        defaultMessage="DISCHARGE PORT ARRIVAL"
      />,
      <FormattedMessage
        id="modules.Shipments.customsClearance"
        defaultMessage="CUSTOMS CLEARANCE"
      />,
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
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: orderMessages.PI.id,
    name: 'piNo',
    type: 'text',
  },
  {
    messageId: orderMessages.date.id,
    name: 'issuedAt',
    type: 'date',
  },
  {
    messageId: orderMessages.exporter.id,
    name: 'exporter.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: orderMessages.currency.id,
    name: 'currency',
    type: 'enum',
    meta: {
      enumType: 'Currency',
      isRequired: true,
    },
  },
  {
    messageId: orderMessages.incoterm.id,
    name: 'incoterm',
    type: 'enum',
    meta: {
      enumType: 'Incoterm',
    },
  },
  {
    messageId: orderMessages.deliveryPlace.id,
    name: 'deliveryPlace',
    type: 'text',
  },
  {
    messageId: orderMessages.inCharge.id,
    name: 'inCharges',
    type: 'inCharges',
    meta: {
      max: 5,
    },
    getExportValue: ({ inCharges }: { inCharges: Array<Object> } = {}) =>
      inCharges &&
      inCharges.reduce((field, value) => `${field}${value.firstName} ${value.lastName}, `, ''),
  },
  {
    messageId: orderMessages.tags.id,
    name: 'tags',
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
    messageId: 'modules.ProductProviders.exporter',
    name: 'productProvider.exporter.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'modules.ProductProviders.supplier',
    name: 'productProvider.supplier.name',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'modules.ProductProviders.unitPrice',
    name: 'price.amount',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: 'modules.ProductProviders.unitPriceCurrency',
    name: 'price.currency',
    type: 'text',
    meta: {
      disabled: true,
    },
  },
  {
    messageId: 'global.quantity',
    name: 'quantity',
    type: 'number',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: orderMessages.totalPrice.id,
    name: 'orderItemTotalPrice',
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
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: 'modules.Products.serial',
    name: 'serial',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: 'modules.Products.janCode',
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
    type: 'text',
  },
  {
    messageId: productMessages.tags.id,
    name: 'tags',
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
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: batchMessages.quantity.id,
    name: 'quantity',
    type: 'numberAdjustment',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: batchMessages.deliveredAt.id,
    name: 'deliveredAt',
    type: 'date',
  },
  {
    messageId: batchMessages.desiredAt.id,
    name: 'desiredAt',
    type: 'date',
  },
  {
    messageId: batchMessages.expiredAt.id,
    name: 'expiredAt',
    type: 'date',
  },
  {
    messageId: batchMessages.producedAt.id,
    name: 'producedAt',
    type: 'date',
  },
  {
    messageId: batchMessages.tags.id,
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
    type: 'text',
  },
  {
    messageId: batchMessages.packageQuantity.id,
    name: 'packageQuantity',
    type: 'number',
  },
  {
    messageId: batchMessages.packageGrossWeight.id,
    name: 'packageGrossWeight',
    type: 'metric',
    meta: {
      metrics: weightMetrics,
      convert: weightConvert,
    },
    getExportValue: ({ packageGrossWeight }: { packageGrossWeight: Object } = {}) =>
      packageGrossWeight && `${packageGrossWeight.value} ${packageGrossWeight.metric}`,
  },
  {
    messageId: batchMessages.packageVolume.id,
    name: 'packageVolume',
    type: 'metric',
    meta: {
      metrics: volumeMetrics,
      convert: volumeConvert,
    },
    getExportValue: ({ packageVolume }: { packageVolume: Object } = {}) =>
      packageVolume && `${packageVolume.value} ${packageVolume.metric}`,
  },
  {
    messageId: 'modules.Batches.pkgWidth',
    name: 'packageSize.width',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
      sourcePath: 'packageSize',
      destPath: 'width',
    },
    getExportValue: ({ packageSize }: { packageSize: Object } = {}) =>
      packageSize && packageSize.width && `${packageSize.width.value} ${packageSize.width.metric}`,
  },
  {
    messageId: 'modules.Batches.pkgHeight',
    name: 'packageSize.height',
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
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
    type: 'metric',
    meta: {
      metrics: distanceMetrics,
      convert: distanceConvert,
      sourcePath: 'packageSize',
      destPath: 'length',
    },
    getExportValue: ({ packageSize }: { packageSize: Object } = {}) =>
      packageSize &&
      packageSize.length &&
      `${packageSize.length.value} ${packageSize.length.metric}`,
  },
];

export const shipmentColumnFields = [
  {
    messageId: shipmentMessages.shipmentId.id,
    name: 'no',
    type: 'text',
    meta: {
      isRequired: true,
    },
  },
  {
    messageId: shipmentMessages.blNo.id,
    name: 'blNo',
    type: 'text',
  },
  {
    messageId: shipmentMessages.blDate.id,
    name: 'blDate',
    type: 'date',
  },
  {
    messageId: shipmentMessages.bookingNo.id,
    name: 'bookingNo',
    type: 'text',
  },
  {
    messageId: shipmentMessages.bookingDate.id,
    name: 'bookingDate',
    type: 'date',
  },
  {
    messageId: shipmentMessages.invoiceNo.id,
    name: 'invoiceNo',
    type: 'text',
  },
  {
    messageId: shipmentMessages.transportType.id,
    name: 'transportType',
    type: 'enum',
    meta: {
      enumType: 'TransportType',
    },
  },
  {
    messageId: shipmentMessages.loadType.id,
    name: 'loadType',
    type: 'enum',
    meta: {
      enumType: 'LoadType',
    },
  },
  {
    messageId: shipmentMessages.incoterms.id,
    name: 'incoterm',
    type: 'enum',
    meta: {
      enumType: 'Incoterm',
    },
  },
  {
    messageId: shipmentMessages.carrier.id,
    name: 'carrier',
    type: 'text',
  },
  {
    messageId: shipmentMessages.forwarder.id,
    name: 'forwarders',
    type: 'forwarders',
    meta: {
      max: 4,
    },
    getExportValue: ({ forwarders }: { forwarders: Array<Object> } = {}) =>
      forwarders && forwarders.reduce((field, value) => `${field}${value.name}, `, ''),
  },
  {
    messageId: 'modules.Shipments.inCharge',
    name: 'inCharges',
    type: 'inCharges',
    meta: {
      max: 5,
    },
    getExportValue: ({ inCharges }: { inCharges: Array<Object> } = {}) =>
      inCharges &&
      inCharges.reduce((field, value) => `${field}${value.firstName} ${value.lastName}, `, ''),
  },
  {
    messageId: shipmentMessages.tags.id,
    name: 'tags',
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
      return `${total}${allCurrencies[0]}`;
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
    type: 'timeline',
    getExportValue: ({ cargoReady }: { cargoReady: Object } = {}) => cargoReady && cargoReady.date,
  },
  {
    messageId: 'modules.Shipments.loadPortDeparture',
    name: 'voyages.0.departure',
    type: 'timeline',
    getExportValue: ({ voyages }: { voyages: Array<Object> } = {}) => {
      const dates = getByPathWithDefault([], '0.departure.timelineDateRevisions', voyages);
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
  },
  {
    messageId: 'modules.Shipments.firstTransitPortArrival',
    getFieldValue: ({ voyages }: { voyages: Array<Object> }) =>
      getByPath(`${voyages && voyages.length > 1 ? '0' : ''}.arrival`, voyages),
    getExportValue: ({ voyages }: { voyages: Array<Object> } = {}) => {
      const dates = getByPathWithDefault(
        [],
        `${voyages && voyages.length > 1 ? '0' : ''}.arrival.timelineDateRevisions`,
        voyages
      );
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
    name: 'voyages.0.arrival',
    type: 'timeline',
  },
  {
    messageId: 'modules.Shipments.firstTransitPortDeparture',
    name: 'voyages.1.departure',
    type: 'timeline',
    getExportValue: ({ voyages }: { voyages: Array<Object> } = {}) => {
      const dates = getByPathWithDefault([], '1.departure.date', voyages);
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
  },
  {
    messageId: 'modules.Shipments.secondTransitPortArrival',
    getFieldValue: ({ voyages }: { voyages: Array<Object> }) =>
      getByPath(`${voyages && voyages.length > 2 ? '1' : ''}.arrival`, voyages),
    getExportValue: ({ voyages }: { voyages: Array<Object> } = {}) => {
      const dates = getByPathWithDefault(
        [],
        `${voyages && voyages.length > 2 ? '1' : ''}.arrival.timelineDateRevisions`,
        voyages
      );
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
    name: 'voyages.1.arrival',
    type: 'timeline',
  },
  {
    messageId: 'modules.Shipments.secondTransitPortDeparture',
    name: 'voyages.2.departure',
    type: 'timeline',
    getExportValue: ({ voyages }: { voyages: Array<Object> } = {}) => {
      const dates = getByPathWithDefault([], '2.departure.timelineDateRevisions', voyages);
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
  },
  {
    messageId: 'modules.Shipments.dischargePortArrival',
    getFieldValue: ({ voyages }: { voyages: Array<Object> }) => {
      const index = voyages ? voyages.length - 1 : 0;
      return getByPath(`${index}.arrival`, voyages);
    },
    getFieldName: ({ voyages }: { voyages: Array<Object> }) =>
      `voyages.${voyages ? voyages.length - 1 : 0}.arrival`,
    getExportValue: ({ voyages }: { voyages: Array<Object> } = {}) => {
      const index = voyages ? voyages.length - 1 : 0;
      const dates = getByPathWithDefault([], `${index}.arrival.timelineDateRevisions`, voyages);
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
    name: 'voyages.2.arrival',
    type: 'timeline',
  },
  {
    messageId: 'modules.Shipments.customsClearance',
    name: 'containerGroups.0.customClearance',
    type: 'timeline',
    getExportValue: ({ containerGroups }: { containerGroups: Array<Object> } = {}) => {
      const dates = getByPathWithDefault(
        [],
        '0.customClearance.timelineDateRevisions',
        containerGroups
      );
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
  },
  {
    messageId: 'modules.Shipments.warehouseArrival',
    name: 'containerGroups.0.warehouseArrival',
    type: 'timeline',
    getExportValue: ({ containerGroups }: { containerGroups: Array<Object> } = {}) => {
      const dates = getByPathWithDefault(
        '',
        '0.warehouseArrival.timelineDateRevisions',
        containerGroups
      );
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
  },
  {
    messageId: 'modules.Shipments.deliveryReady',
    name: 'containerGroups.0.deliveryReady',
    type: 'timeline',
    getExportValue: ({ containerGroups }: { containerGroups: Array<Object> } = {}) => {
      const dates = getByPathWithDefault('', '0.deliveryReady.date', containerGroups);
      const lastDate = dates[dates.length - 1];
      return lastDate && lastDate.date;
    },
  },
];

export const orderColumnIds: Array<string> = orderColumnFields.map(mapColumnId(ORDER));

export const orderItemColumnIds: Array<string> = orderItemColumnFields.map(mapColumnId(ORDER_ITEM));

export const batchColumnIds: Array<string> = batchColumnFields.map(mapColumnId(BATCH));

export const shipmentColumnIds: Array<string> = shipmentColumnFields.map(mapColumnId(SHIPMENT));

export const productColumnIds: Array<string> = productColumnFields.map(mapColumnId(PRODUCT));

export const allColumnIds = [
  ...orderColumnIds,
  ...orderItemColumnIds,
  ...batchColumnIds,
  ...shipmentColumnIds,
  ...productColumnIds,
];
