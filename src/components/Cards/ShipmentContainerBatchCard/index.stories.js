/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ShipmentContainerBatchCard from './index';

const batch = {
  id: 'Batch',
  no: 'test batch',
  quantity: 10,
  deliveredAt: '2019-01-16T06:28:52.643Z',
  desiredAt: '2019-01-16T06:28:52.643Z',
  batchAdjustments: [],
  totalAdjusted: 0,
  packageVolume: {
    value: 10,
    metric: 'm',
  },
  packageQuantity: 10,
  tags: [],
  orderItem: {
    price: 4000,
    productProvider: {
      product: {
        name: 'test product',
        serial: '3464563378',
      },
      supplier: { name: 'test suppli' },
      exporter: { name: 'exprot' },
    },
    order: { poNo: 'testp osno' },
  },
  container: { no: 'test container' },
  shipment: {
    id: '324234',
    no: 'test shipment',
  },
};
storiesOf('Card', module)
  .add('ShipmentContainerBatchCard (isRepresented)', () => (
    <IntlProvider>
      <Provider>
        <ShipmentContainerBatchCard
          batch={batch}
          currency="JPY"
          isRepresented
          onClickRepresentative={action('onClickRepresentative')}
        />
      </Provider>
    </IntlProvider>
  ))
  .add('ShipmentContainerBatchCard (is not Represented)', () => (
    <IntlProvider>
      <Provider>
        <ShipmentContainerBatchCard
          batch={batch}
          currency="JPY"
          isRepresented={false}
          onClickRepresentative={action('onClickRepresentative')}
        />
      </Provider>
    </IntlProvider>
  ));
