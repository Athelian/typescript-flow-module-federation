import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FilterByPONo from '../forms/FilterByPONo';

const filterByOrderDS = [
  {
    key: 'order.multiSelect.poNo',
    type: 'multi-select',
    readOnly: false,
    disabled: false,
    label: <FormattedMessage id="modules.relationMap.filter.PONo" defaultMessage="PO No." />,
    form: <FilterByPONo />,
  },
  {
    key: 'order.multiSelect.exporterId',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.exporter" defaultMessage="Exporter" />,
    form: null,
  },
  {
    key: 'order.multiSelect.tagIds',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.tag" defaultMessage="Tag" />,
    form: null,
  },
  {
    key: 'order.multiSelect.assignment',
    type: 'multi-select',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.assignment"
        defaultMessage="InCharge / Assignment"
      />
    ),
    form: null,
  },
  {
    key: 'order.range.created',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.created" defaultMessage="Created" />,
    form: null,
  },
  {
    key: 'order.range.updatedAt',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.lastModified"
        defaultMessage="Last Modified"
      />
    ),
    form: null,
  },
  {
    key: 'order.checkbox.unBatched',
    type: 'checkbox',
    icon: 'BATCH_LIGHT',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.relationMap.filter.unBatched" defaultMessage="UnBatched" />
    ),
    form: null,
  },
  {
    key: 'order.checkbox.unShipped',
    type: 'checkbox',
    icon: 'SHIPMENT_LIGHT',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.relationMap.filter.unShipped" defaultMessage="UnShipped" />
    ),
    form: null,
  },
  {
    key: 'order.checkbox.includeArchived',
    type: 'checkbox',
    icon: 'ARCHIVE_LIGHT',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.includeArchived"
        defaultMessage="Include Archived"
      />
    ),
    form: null,
  },
  {
    key: 'order.checkbox.onlyArchived',
    type: 'checkbox',
    icon: 'ARCHIVE_LIGHT',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.onlyArchived"
        defaultMessage="Only Archived"
      />
    ),
    form: null,
  },
];

export default filterByOrderDS;
