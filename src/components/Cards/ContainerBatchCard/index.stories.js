/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ContainerBatchCard from './index';

const batch = {
  id: 'Batch',
  no: 'test batch',
  quantity: 10,
  deliveredAt: '2019-01-16T06:28:52.643Z',
  desiredAt: '2019-01-16T06:28:52.643Z',
  batchAdjustments: [],
  packageVolume: 'm',
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
    order: {},
  },
};
storiesOf('Container', module)
  .add('ContainerBatchCard (isRepresented)', () => (
    <IntlProvider>
      <Provider>
        <ContainerBatchCard
          batch={batch}
          currency="JPY"
          isRepresented
          onClickRepresentative={action('onClickRepresentative')}
        />
      </Provider>
    </IntlProvider>
  ))
  .add('ContainerBatchCard (is not Represented)', () => (
    <IntlProvider>
      <Provider>
        <ContainerBatchCard
          batch={batch}
          currency="JPY"
          isRepresented={false}
          onClickRepresentative={action('onClickRepresentative')}
        />
      </Provider>
    </IntlProvider>
  ));
