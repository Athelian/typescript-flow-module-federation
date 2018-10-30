import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const filterByOrderDS = [
  {
    key: 'productName',
    type: 'multi-select',
    readOnly: false,
    disabled: false,
    label: (
      <FormattedMessage id="modules.relationMap.filter.productName" defaultMessage="Product Name" />
    ),
    form: null,
  },
  {
    key: 'productSerial',
    type: 'multi-select',
    readOnly: false,
    disabled: false,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.productSerial"
        defaultMessage="Product Serial"
      />
    ),
    form: null,
  },
  {
    key: 'janCode',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.janCode" defaultMessage="JAN Code" />,
    form: null,
  },
  {
    key: 'hsCode',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.hsCode" defaultMessage="HS Code" />,
    form: null,
  },
  {
    key: 'exporter',
    type: 'multi-select',
    limit: 1,
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.exporter" defaultMessage="Exporter" />,
    form: null,
  },
  {
    key: 'supplier',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.supplier" defaultMessage="Supplier" />,
    form: null,
  },
  {
    key: 'countryOfOrigin',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage
        id="modules.relationMap.filter.countryOfOrigin"
        defaultMessage="Country of Origin"
      />
    ),
    form: null,
  },
  {
    key: 'currency',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.currency" defaultMessage="Currency" />,
    form: null,
  },
  {
    key: 'packageInfo',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: (
      <FormattedMessage id="modules.relationMap.filter.packageInfo" defaultMessage="Package Info" />
    ),
    form: null,
  },
  {
    key: 'metadata',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.metadata" defaultMessage="Meta Data" />,
    form: null,
  },
  {
    key: 'tag',
    type: 'multi-select',
    readOnly: false,
    disabled: true,
    label: <FormattedMessage id="modules.relationMap.filter.tag" defaultMessage="Tag" />,
    form: null,
  },
];

export default filterByOrderDS;
