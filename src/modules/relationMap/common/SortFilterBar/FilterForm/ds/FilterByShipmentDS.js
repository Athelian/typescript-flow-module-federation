import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const filterByOrderDS = [
  {
    key: 'shipment.multiSelect.tagIds',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.tag" defaultMessage="Tag" />,
    form: null,
  },
  {
    key: 'shipment.multiSelect.carrier',
    type: 'multiSelect',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.carrier" defaultMessage="Carrier" />,
    form: null,
  },
  {
    key: 'shipment.multiSelect.forwarder',
    type: 'multiSelect',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.relationMap.filter.forwarder" defaultMessage="Forwarder" />
    ),
    form: null,
  },
  {
    key: 'shipment.multiSelect.loadPortName',
    type: 'multiSelect',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.loadPortName"
        defaultMessage="Load Port Name"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.multiSelect.dischargePortName',
    type: 'multiSelect',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.dischargePortName"
        defaultMessage="Discharge Port Name"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.multiSelect.transitPort1Name',
    type: 'multiSelect',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.transitPort1Name"
        defaultMessage="Transit Port 1 Name"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.multiSelect.transitPort2Name',
    type: 'multiSelect',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.transitPort2Name"
        defaultMessage="Transit Port 2 Name"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.multiSelect.warehouseName',
    type: 'multiSelect',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.warehouseName"
        defaultMessage="Warehouse Name"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.cargoReady',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.relationMap.filter.cargoReady" defaultMessage="CargoReady" />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.departureFromLoadPort',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.departureFromLoadPort"
        defaultMessage="Departure from Load Port"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.arrivalAtDischargePort',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.arrivalAtDischargePort"
        defaultMessage="Arrival at Discharge Port"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.arrivalAtTransitPort1',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.arrivalAtTransitPort1"
        defaultMessage="Arrival at Transit Port 1"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.departureFromTransitPort1',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.departureFromTransitPort1"
        defaultMessage="Departure from Transit Port 1"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.arrivalAtTransitPort2',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.arrivalAtTransitPort2"
        defaultMessage="Arrival at Transit Port 2"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.departureFromTransitPort2',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.departureFromTransitPort2"
        defaultMessage="Departure from Transit Port 2"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.customClearance',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.customClearance"
        defaultMessage="Custom Clearance"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.warehouseArrival',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.warehouseArrival"
        defaultMessage="WarehouseArrival"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.checkbox.deliveryReady',
    type: 'checkbox',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.deliveryReady"
        defaultMessage="DeliveryReady"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.cargoReadyDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.relationMap.filter.cargoReady" defaultMessage="CargoReady" />
    ),
    form: null,
  },
  {
    key: 'shipment.range.departureFromLoadPortDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.departureFromLoadPort"
        defaultMessage="Departure from Load Port"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.arrivalAtDischargePortDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.arrivalAtDischargePort"
        defaultMessage="Arrival at Discharge Port"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.arrivalAtTransitPort1Date',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.arrivalAtTransitPort1"
        defaultMessage="Arrival at Transit Port 1"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.departureFromTransitPort1Date',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.departureFromTransitPort1"
        defaultMessage="Departure from Transit Port 1"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.arrivalAtTransitPort2Date',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.arrivalAtTransitPort2"
        defaultMessage="Arrival at Transit Port 2"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.departureFromTransitPort2Date',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.departureFromTransitPort2"
        defaultMessage="Departure from Transit Port 2"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.customClearanceDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.customClearance"
        defaultMessage="Custom Clearance"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.warehouseArrivalDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.warehouseArrival"
        defaultMessage="WarehouseArrival"
      />
    ),
    form: null,
  },
  {
    key: 'shipment.range.deliveryReadyDate',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.deliveryReady"
        defaultMessage="DeliveryReady"
      />
    ),
    form: null,
  },
];

export default filterByOrderDS;
