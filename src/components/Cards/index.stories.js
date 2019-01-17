import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
// action
// import { action } from '@storybook/addon-actions';
import { IntlProvider } from 'react-intl';
import { translationMessages } from 'i18n';
import { Provider } from 'unstated';

import { ShipmentCard, ShipmentContainerCard } from './index';

const shipment = {
  archived: true,
  batchCount: 0,
  batches: [],
  blNo: null,
  cargoReady: {
    id: '2836',
    date: null,
    approvedAt: null,
    timelineDateRevisions: [],
    __typename: 'TimelineDate',
  },
  containerGroups: [{ id: '440' }],
  id: '323',
  inCharges: [
    { id: 'bfbs7phml5i000areofg', firstName: 'Jackie', lastName: 'Lowe', __typename: 'User' },
  ],
  no: 'check the custom field',
  orderItemCount: 0,
  tags: [],
  totalVolume: { value: 0, metric: 'm³', __typename: 'MetricValue' },
  transportType: null,
  voyages: [{ id: '569', departurePort: { seaport: null, airport: null, __typename: 'Port' } }],
};

const container = {
  representativeBatch: {
    orderItem: {
      productProvider: {
        product: {
          name: 'product name',
          serial: 'product serial',
        },
      },
    },
  },
  no: 'container no',
  totalVolume: { value: '25000000000', metric: 'm³' },
  batches: [{}, {}, {}],
  warehouse: {
    name: 'warehouse name',
  },
  warehouseArrivalAgreedDate: '2019-01-16T13:59',
  warehouseArrivalAgreedDateApprovedBy: null,
  warehouseArrivalActualDate: '2019-01-16T17:59',
  warehouseArrivalActualDateApprovedBy: {},
  tags: [
    { id: 'bfrsvt4s7cccia20kjtg', name: 'tag1', color: '#c4ebff' },
    { id: 'bfrsvt4s7cccia20kjth', name: 'TAG A', color: '#a4ebff' },
    { id: 'bfrsvt4s7cccia20kjti', name: 'TAG TAG TAG TAG', color: '#c4abff' },
  ],
};

storiesOf('Card', module)
  .add('ShipmentCard', () => (
    <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
      <ShipmentCard shipment={shipment} />
    </IntlProvider>
  ))
  .add('ShipmentContainerCard', () => (
    <Provider>
      <IntlProvider locale="en" messages={translationMessages.en} textComponent={React.Fragment}>
        <ShipmentContainerCard container={container} />
      </IntlProvider>
    </Provider>
  ));
