import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';

import Table from './index';

// const order = {
//   id: 1,
//   'order.name': 'order 1',
//   'order.other': 'order 1 other fields long long long long long long long long',
//   __children: [
//     {
//       id: 1,
//       'orderItem.name': 'order item 1',
//       'orderItem.other': 'order item 1 other fields',
//       __children: [
//         {
//           id: 1,
//           'batch.name': 'batch 1',
//           'batch.other': 'batch 1 other fields',
//         },
//         {
//           id: 2,
//           'batch.name': 'batch 2',
//           'batch.other': 'batch 2 other fields',
//         },
//       ],
//     },
//     {
//       id: 2,
//       'orderItem.name': 'order item 2',
//       'orderItem.other': 'order item 2 other fields',
//       __children: [
//         {
//           id: 3,
//           'batch.name': 'batch 3',
//           'batch.other': 'batch 3 other fields',
//         },
//       ],
//     },
//   ],
// };
// const data = [order, order, order, order, order, order, order, order, order, order];

const data = [
  [
    { key: 'order.name', value: 'order1' },
    { key: 'orderItem.name', value: 'orderItem1' },
    { key: 'batch.name', value: 'batch1' },
  ],
  [
    { key: 'order.name', value: null },
    { key: 'orderItem.name', value: null },
    { key: 'batch.name', value: 'batch2' },
  ],
  [
    { key: 'order.name', value: null },
    { key: 'orderItem.name', value: 'orderItem2' },
    { key: 'batch.name', value: 'batch3' },
  ],
];
const keys = ['order.name', 'orderItem.name', 'batch.name'];

storiesOf('Modules/GlobalView', module).add('starter', () => (
  <Table keys={keys} data={[...data, ...data, ...data, ...data]} />
));
