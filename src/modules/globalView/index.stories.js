import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';

import Table from './Table';

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

// const mockObject = { key: 'any', value: 'any' };
const mockHeaderItems = ['order', 'order others', 'item', 'item others', 'batch', 'batch others'];
const mockData = [
  [
    { key: 'order.1.name', start: 0, lines: 3, value: 'order 1' },
    { key: 'order.1.others', start: 0, lines: 3, value: 'order 1 others' },
    { key: 'item.1.name', start: 0, lines: 2, value: 'item 1' },
    { key: 'item.1.others', start: 0, lines: 2, value: 'item 1 others' },
    { key: 'batch.1.name', start: 0, lines: 1, value: 'batch 1' },
    { key: 'batch.1.others', start: 0, lines: 1, value: 'batch 1 others' },
  ],
  [
    { key: 'order.1.name', start: 0, lines: 3, value: '' },
    { key: 'order.1.others', start: 0, lines: 3, value: '' },
    { key: 'item.1.name', start: 0, lines: 2, value: '' },
    { key: 'item.1.others', start: 0, lines: 2, value: '' },
    { key: 'batch.2.name', start: 1, lines: 1, value: 'batch 2' },
    { key: 'batch.2.others', start: 1, lines: 1, value: 'batch 2 others' },
  ],
  [
    { key: 'order.1.name', start: 0, lines: 3, value: '' },
    { key: 'order.1.others', start: 0, lines: 3, value: '' },
    { key: 'item.2.name', start: 2, lines: 1, value: 'item 2' },
    { key: 'item.2.others', start: 2, lines: 1, value: 'item 2 others' },
    { key: 'batch.3.name', start: 2, lines: 1, value: 'batch 3' },
    { key: 'batch.3.others', start: 2, lines: 1, value: 'batch 3 others' },
  ],
  // copy
  [
    { key: 'order.2.name', start: 3, lines: 3, value: 'order 1' },
    { key: 'order.2.others', start: 3, lines: 3, value: 'order 1 others' },
    { key: 'item.3.name', start: 3, lines: 2, value: 'item 1' },
    { key: 'item.3.others', start: 3, lines: 2, value: 'item 1 others' },
    { key: 'batch.4.name', start: 3, lines: 1, value: 'batch 1' },
    { key: 'batch.4.others', start: 3, lines: 1, value: 'batch 1 others' },
  ],
  [
    { key: 'order.2.name', start: 3, lines: 3, value: '' },
    { key: 'order.2.others', start: 3, lines: 3, value: '' },
    { key: 'item.3.name', start: 3, lines: 2, value: '' },
    { key: 'item.3.others', start: 3, lines: 2, value: '' },
    { key: 'batch.5.name', start: 4, lines: 1, value: 'batch 2' },
    { key: 'batch.5.others', start: 4, lines: 1, value: 'batch 2 others' },
  ],
  [
    { key: 'order.2.name', start: 3, lines: 3, value: '' },
    { key: 'order.2.others', start: 3, lines: 3, value: '' },
    { key: 'item.4.name', start: 5, lines: 1, value: 'item 2' },
    { key: 'item.4.others', start: 5, lines: 1, value: 'item 2 others' },
    { key: 'batch.6.name', start: 5, lines: 1, value: 'batch 3' },
    { key: 'batch.6.others', start: 5, lines: 1, value: 'batch 3 others' },
  ],
];

const columnWidths = mockHeaderItems.map(() => 200);

storiesOf('Modules/GlobalView', module).add('virtual list', () => (
  <div
    style={{
      height: '80vh',
      width: '80vw',
    }}
  >
    <Table columnWidths={columnWidths} keys={mockHeaderItems} data={mockData} />
  </div>
));
