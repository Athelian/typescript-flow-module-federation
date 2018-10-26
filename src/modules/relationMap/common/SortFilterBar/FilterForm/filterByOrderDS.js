import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FilterByPONo from './components/FilterByPONo';

const filterByOrderDS = [
  {
    key: 'poNo',
    readOnly: false,
    disabled: false,
    label: <FormattedMessage id="modules.relationMap.filter.PONo" defaultMessage="PO No." />,
    form: <FilterByPONo />,
  },
  {
    key: 'exporterId',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.exporter" defaultMessage="Exporter" />,
    form: null,
  },
  {
    key: 'tagIds',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.tag" defaultMessage="Tag" />,
    form: null,
  },
  {
    key: 'assignment',
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
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.created" defaultMessage="Created" />,
    form: null,
  },
  {
    key: 'updatedAt',
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
];

export default filterByOrderDS;
