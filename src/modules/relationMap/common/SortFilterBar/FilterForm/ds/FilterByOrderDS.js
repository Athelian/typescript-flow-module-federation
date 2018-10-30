import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FilterByPONo from '../forms/FilterByPONo';

const filterByOrderDS = [
  {
    key: 'poNo',
    type: 'multi-select',
    readOnly: false,
    disabled: false,
    label: <FormattedMessage id="modules.relationMap.filter.PONo" defaultMessage="PO No." />,
    form: <FilterByPONo />,
  },
  {
    key: 'exporterId',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.exporter" defaultMessage="Exporter" />,
    form: null,
  },
  {
    key: 'tagIds',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.tag" defaultMessage="Tag" />,
    form: null,
  },
  {
    key: 'assignment',
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
    key: 'created',
    type: 'range',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.created" defaultMessage="Created" />,
    form: null,
  },
  {
    key: 'updatedAt',
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
    key: 'unBatched',
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
    key: 'unShipped',
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
    key: 'includeArchived',
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
    key: 'onlyArchived',
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
