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
const mockHeaderItems = [
  'order',
  'order others',
  'item',
  'item others',
  'batch name',
  'batch 1',
  'batch 2',
  'batch 3',
  'batch 4',
  'batch 5',
  'batch 6',
  'batch 7',
  'batch 8',
  'batch 9',
  'batch 10',
  'batch 11',
  'batch 12',
  'batch 13',
  'batch 14',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
];
const mockData = [
  [
    { key: 'order.1.name', start: 0, lines: 4, value: 'order 1' },
    { key: 'order.1.others', start: 0, lines: 4, value: 'order 1 others' },
    { key: 'item.1.name', start: 0, lines: 2, value: 'item 1' },
    { key: 'item.1.others', start: 0, lines: 2, value: 'item 1 others' },
    { key: 'batch.1.name', start: 0, lines: 1, value: 'batch 1' },
    { key: 'batch.1.1', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.2', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.3', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.4', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.5', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.6', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.7', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.8', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.9', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.10', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.11', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.12', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.13', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'batch.1.14', start: 0, lines: 1, value: 'batch 1 others' },
    { key: 'any 1', start: 0, lines: 1, value: 'any 1' },
    { key: 'any 2', start: 0, lines: 1, value: 'any 2' },
    { key: 'any 3', start: 0, lines: 1, value: 'any 3' },
    { key: 'any 4', start: 0, lines: 1, value: 'any 4' },
    { key: 'any 5', start: 0, lines: 1, value: 'any 5' },
    { key: 'any 6', start: 0, lines: 1, value: 'any 6' },
    { key: 'any 7', start: 0, lines: 1, value: 'any 7' },
    { key: 'any 8', start: 0, lines: 1, value: 'any 8' },
    { key: 'any 9', start: 0, lines: 1, value: 'any 9' },
    { key: 'any 10', start: 0, lines: 1, value: 'any 10' },
    { key: 'any 11', start: 0, lines: 1, value: 'any 11' },
    { key: 'any 12', start: 0, lines: 1, value: 'any 12' },
    { key: 'any 13', start: 0, lines: 1, value: 'any 13' },
  ],
  [
    { key: 'order.1.name', start: 0, lines: 4, value: '' },
    { key: 'order.1.others', start: 0, lines: 4, value: '' },
    { key: 'item.1.name', start: 0, lines: 2, value: '' },
    { key: 'item.1.others', start: 0, lines: 2, value: '' },
    { key: 'batch.2.name', start: 1, lines: 1, value: 'batch 2' },
    { key: 'batch.2.others', start: 1, lines: 1, value: 'batch 2 others' },
  ],
  [
    { key: 'order.1.name', start: 0, lines: 4, value: '' },
    { key: 'order.1.others', start: 0, lines: 4, value: '' },
    { key: 'item.2.name', start: 2, lines: 2, value: 'item 2' },
    { key: 'item.2.others', start: 2, lines: 2, value: 'item 2 others' },
    { key: 'batch.3.name', start: 2, lines: 1, value: 'batch 3' },
    { key: 'batch.3.others', start: 2, lines: 1, value: 'batch 3 others' },
  ],
  [
    { key: 'order.1.name', start: 0, lines: 4, value: '' },
    { key: 'order.1.others', start: 0, lines: 4, value: '' },
    { key: 'item.2.name', start: 2, lines: 2, value: '' },
    { key: 'item.2.others', start: 2, lines: 2, value: '' },
    { key: 'batch.100.name', start: 3, lines: 1, value: 'batch 100' },
    { key: 'batch.100.others', start: 3, lines: 1, value: 'batch 100 others' },
  ],
  // copy
  [
    { key: 'order.2.name', start: 4, lines: 3, value: 'order 1' },
    { key: 'order.2.others', start: 4, lines: 3, value: 'order 1 others' },
    { key: 'item.3.name', start: 4, lines: 2, value: 'item 1' },
    { key: 'item.3.others', start: 4, lines: 2, value: 'item 1 others' },
    { key: 'batch.4.name', start: 4, lines: 1, value: 'batch 1' },
    { key: 'batch.4.others', start: 4, lines: 1, value: 'batch 1 others' },
  ],
  [
    { key: 'order.2.name', start: 4, lines: 3, value: '' },
    { key: 'order.2.others', start: 4, lines: 3, value: '' },
    { key: 'item.3.name', start: 4, lines: 2, value: '' },
    { key: 'item.3.others', start: 4, lines: 2, value: '' },
    { key: 'batch.5.name', start: 5, lines: 1, value: 'batch 2' },
    { key: 'batch.5.others', start: 5, lines: 1, value: 'batch 2 others' },
  ],
  [
    { key: 'order.2.name', start: 4, lines: 3, value: '' },
    { key: 'order.2.others', start: 4, lines: 3, value: '' },
    { key: 'item.4.name', start: 6, lines: 1, value: 'item 2' },
    { key: 'item.4.others', start: 6, lines: 1, value: 'item 2 others' },
    { key: 'batch.6.name', start: 6, lines: 1, value: 'batch 3' },
    { key: 'batch.6.others', start: 6, lines: 1, value: 'batch 3 others' },
  ],
  [
    { key: 'order.3.name', start: 7, lines: 3, value: 'order 1' },
    { key: 'order.3.others', start: 7, lines: 3, value: 'order 1 others' },
    { key: 'item.5.name', start: 7, lines: 2, value: 'item 1' },
    { key: 'item.5.others', start: 7, lines: 2, value: 'item 1 others' },
    { key: 'batch.7.name', start: 7, lines: 1, value: 'batch 1' },
    { key: 'batch.7.others', start: 7, lines: 1, value: 'batch 1 others' },
  ],
  [
    { key: 'order.3.name', start: 7, lines: 3, value: '' },
    { key: 'order.3.others', start: 7, lines: 3, value: '' },
    { key: 'item.5.name', start: 7, lines: 2, value: '' },
    { key: 'item.5.others', start: 7, lines: 2, value: '' },
    { key: 'batch.8.name', start: 8, lines: 1, value: 'batch 2' },
    { key: 'batch.8.others', start: 8, lines: 1, value: 'batch 2 others' },
  ],
  [
    { key: 'order.3.name', start: 7, lines: 3, value: '' },
    { key: 'order.3.others', start: 7, lines: 3, value: '' },
    { key: 'item.6.name', start: 9, lines: 1, value: 'item 2' },
    { key: 'item.6.others', start: 9, lines: 1, value: 'item 2 others' },
    { key: 'batch.9.name', start: 9, lines: 1, value: 'batch 3' },
    { key: 'batch.9.others', start: 9, lines: 1, value: 'batch 3 others' },
  ],
  [{ key: 'order.10.name', start: 10, lines: 1, value: 'order.10.name' }],
  [{ key: 'order.11.name', start: 11, lines: 1, value: 'order.11.name' }],
  [{ key: 'order.12.name', start: 12, lines: 1, value: 'order.12.name' }],
  [{ key: 'order.13.name', start: 13, lines: 1, value: 'order.13.name' }],
  [{ key: 'order.14.name', start: 14, lines: 1, value: 'order.14.name' }],
  [{ key: 'order.15.name', start: 15, lines: 1, value: 'order.15.name' }],
  [{ key: 'order.16.name', start: 16, lines: 1, value: 'order.16.name' }],
  [{ key: 'order.17.name', start: 17, lines: 1, value: 'order.17.name' }],
  [{ key: 'order.18.name', start: 18, lines: 1, value: 'order.18.name' }],
  [{ key: 'order.19.name', start: 19, lines: 1, value: 'order.19.name' }],
];

const columnWidths = mockHeaderItems.map(() => 200);

storiesOf('Modules/GlobalView', module).add('virtual list', () => (
  <div
    style={{
      height: '50vh',
      width: '80vw',
    }}
  >
    <Table columnWidths={columnWidths} keys={mockHeaderItems} data={mockData} />
  </div>
));
