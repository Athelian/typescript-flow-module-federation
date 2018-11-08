import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const filterByOrderDS = [
  {
    key: 'orderItem.multiSelect.productName',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.RelationMaps.filter.productName"
        defaultMessage="Product Name"
      />
    ),
    form: null,
  },
  {
    key: 'orderItem.multiSelect.productSerial',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.RelationMaps.filter.productSerial"
        defaultMessage="Product Serial"
      />
    ),
    form: null,
  },
  {
    key: 'orderItem.multiSelect.janCode',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.RelationMaps.filter.janCode" defaultMessage="JAN Code" />,
    form: null,
  },
  {
    key: 'orderItem.multiSelect.hsCode',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.RelationMaps.filter.hsCode" defaultMessage="HS Code" />,
    form: null,
  },
  {
    key: 'orderItem.multiSelect.exporter',
    type: 'multiSelect',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.RelationMaps.filter.exporter" defaultMessage="Exporter" />,
    form: null,
  },
  {
    key: 'orderItem.multiSelect.supplier',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.RelationMaps.filter.supplier" defaultMessage="Supplier" />,
    form: null,
  },
  {
    key: 'orderItem.multiSelect.countryOfOrigin',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.RelationMaps.filter.countryOfOrigin"
        defaultMessage="Country of Origin"
      />
    ),
    form: null,
  },
  {
    key: 'orderItem.multiSelect.currency',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.RelationMaps.filter.currency" defaultMessage="Currency" />,
    form: null,
  },
  {
    key: 'orderItem.multiSelect.packageInfo',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.RelationMaps.filter.packageInfo"
        defaultMessage="Package Info"
      />
    ),
    form: null,
  },
  {
    key: 'orderItem.multiSelect.metadata',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.RelationMaps.filter.metadata" defaultMessage="Meta Data" />
    ),
    form: null,
  },
  {
    key: 'orderItem.multiSelect.tag',
    type: 'multiSelect',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.RelationMaps.filter.tag" defaultMessage="Tag" />,
    form: null,
  },
  {
    key: 'orderItem.checkbox.unBatched',
    type: 'checkbox',
    icon: 'BATCH_LIGHT',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.RelationMaps.filter.unBatched" defaultMessage="UnBatched" />
    ),
    form: null,
  },
  {
    key: 'orderItem.checkbox.unShipped',
    type: 'checkbox',
    icon: 'SHIPMENT_LIGHT',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.RelationMaps.filter.unShipped" defaultMessage="UnShipped" />
    ),
    form: null,
  },
  {
    key: 'orderItem.checkbox.includeArchived',
    type: 'checkbox',
    icon: 'ARCHIVE_LIGHT',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.RelationMaps.filter.includeArchived"
        defaultMessage="Include Archived"
      />
    ),
    form: null,
  },
  {
    key: 'orderItem.checkbox.onlyArchived',
    type: 'checkbox',
    icon: 'ARCHIVE_LIGHT',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.RelationMaps.filter.onlyArchived"
        defaultMessage="Only Archived"
      />
    ),
    form: null,
  },
];

export default filterByOrderDS;
