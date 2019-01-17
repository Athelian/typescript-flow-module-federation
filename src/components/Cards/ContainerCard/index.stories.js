/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
import { storiesOf } from '@storybook/react';
import ContainerCard from './index';

const container = {
  id: '6',
  no: 'test some container',
  totalVolume: {
    value: 0,
    metric: 'm³',
    __typename: 'MetricValue',
  },
  batches: [
    {
      id: '4961',
    },
  ],
  representativeBatch: {
    id: '4961',
    orderItem: {
      id: '2227',
      productProvider: {
        id: '2686',
        product: {
          id: '2341',
          name: 'tosltyleo idh',
          serial: '23423434',
        },
      },
    },
  },
  warehouse: {
    id: '237',
    name: 'test tj',
    __typename: 'Warehouse',
  },
  warehouseArrivalAgreedDate: '2019-01-17T07:03:56Z',
  warehouseArrivalActualDate: '2019-01-18T06:18:17Z',
  warehouseArrivalAgreedDateApprovedBy: {
    id: 'bfbs7phml5i000areof0',
    __typename: 'User',
  },
  warehouseArrivalActualDateApprovedBy: null,
  shipment: {
    id: '323',
    no: 'check the custom field',
    __typename: 'Shipment',
  },
  __typename: 'Container',
};
storiesOf('Container', module).add('ContainerCard', () => (
  <IntlProvider>
    <Provider>
      <ContainerCard container={container} />
    </Provider>
  </IntlProvider>
));
